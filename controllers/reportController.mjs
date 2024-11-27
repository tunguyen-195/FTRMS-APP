import Declaration from '../models/Declaration.mjs';
import User from '../models/User.mjs';
import { Parser } from 'json2csv';
import ExcelJS from 'exceljs';

export const generateReport = async (req, res) => {
  try {
    const filters = {};
    if (req.query.nationality) {
      filters.nationality = req.query.nationality;
    }
    if (req.query.dateFrom && req.query.dateTo) {
      filters.check_in = { $gte: new Date(req.query.dateFrom), $lte: new Date(req.query.dateTo) };
    }
    if (req.query.accommodation) {
      filters.accommodation = req.query.accommodation;
    }
    if (req.query.status) {
      filters.status = req.query.status;
    }
    if (req.query.userName) {
      filters['user.name'] = { $regex: req.query.userName, $options: 'i' }; // Case-insensitive search
    }

    const declarations = await Declaration.find(filters).populate('user');

    const reportData = declarations.map(declaration => {
      const stayDuration = declaration.check_out
        ? Math.ceil((new Date(declaration.check_out) - new Date(declaration.check_in)) / (1000 * 60 * 60 * 24))
        : 'Ongoing';

      return {
        ...declaration._doc,
        stayDuration,
        userName: declaration.user.name,
        userEmail: declaration.user.email,
      };
    });

    // Aggregate data for summary
    const totalDeclarations = reportData.length;
    const totalOngoing = reportData.filter(d => d.stayDuration === 'Ongoing').length;
    const totalCompleted = totalDeclarations - totalOngoing;

    res.render('admin/reports', { reportData, filters, totalDeclarations, totalOngoing, totalCompleted });
  } catch (error) {
    console.error('Error generating report:', error);
    req.flash('error_msg', 'Error generating report');
    res.redirect('/admin');
  }
};

export const exportReport = async (req, res) => {
  try {
    const filters = {};
    if (req.query.nationality) {
      filters.nationality = req.query.nationality;
    }
    if (req.query.dateFrom && req.query.dateTo) {
      filters.check_in = { $gte: new Date(req.query.dateFrom), $lte: new Date(req.query.dateTo) };
    }
    if (req.query.accommodation) {
      filters.accommodation = req.query.accommodation;
    }
    if (req.query.status) {
      filters.status = req.query.status;
    }
    if (req.query.userName) {
      filters['user.name'] = { $regex: req.query.userName, $options: 'i' }; // Case-insensitive search
    }

    const declarations = await Declaration.find(filters).populate('user');

    const reportData = declarations.map(declaration => ({
      fullName: declaration.full_name,
      email: declaration.user.email,
      nationality: declaration.nationality,
      accommodation: declaration.accommodation,
      checkIn: declaration.check_in,
      checkOut: declaration.check_out,
      stayDuration: declaration.check_out
        ? Math.ceil((new Date(declaration.check_out) - new Date(declaration.check_in)) / (1000 * 60 * 60 * 24))
        : 'Ongoing',
      status: declaration.status,
    }));

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');

    // Add columns to the worksheet
    worksheet.columns = [
      { header: 'Full Name', key: 'fullName', width: 20 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Nationality', key: 'nationality', width: 15 },
      { header: 'Accommodation', key: 'accommodation', width: 20 },
      { header: 'Check-In', key: 'checkIn', width: 15 },
      { header: 'Check-Out', key: 'checkOut', width: 15 },
      { header: 'Stay Duration (days)', key: 'stayDuration', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
    ];

    // Add rows to the worksheet
    reportData.forEach(data => {
      worksheet.addRow(data);
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=report.xlsx');

    // Write the workbook to the response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error exporting report:', error);
    req.flash('error_msg', 'Error exporting report');
    res.redirect('/admin/reports');
  }
};