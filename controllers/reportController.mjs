import Declaration from '../models/Declaration.mjs';
import User from '../models/User.mjs';
import { Parser } from 'json2csv';
import ExcelJS from 'exceljs';
import Residence from '../models/Residence.mjs';
import logger from '../config/logger.mjs';

export const generateReport = async (req, res) => {
  try {
    const filters = {};
    if (req.query.nationality) {
      filters['foreignResident.nationality'] = req.query.nationality;
    }
    if (req.query.dateFrom && req.query.dateTo) {
      filters.check_in = { $gte: new Date(req.query.dateFrom), $lte: new Date(req.query.dateTo) };
    }
    if (req.query.status) {
      filters.status = req.query.status;
    }

    const residences = await Residence.find(filters)
      .populate('foreignResident')
      .populate('accommodation');

    const reportData = residences.map(residence => ({
      fullName: residence.foreignResident.fullName,
      nationality: residence.foreignResident.nationality,
      accommodation: residence.accommodation.name,
      checkIn: residence.check_in,
      checkOut: residence.check_out,
      stayDuration: residence.check_out
        ? Math.ceil((new Date(residence.check_out) - new Date(residence.check_in)) / (1000 * 60 * 60 * 24))
        : 'Ongoing',
      status: residence.status,
    }));

    res.render('admin/reports', { reportData });
  } catch (error) {
    logger.error('Error generating report:', error);
    req.flash('error_msg', 'Error generating report');
    res.redirect('/admin');
  }
};

export const exportReport = async (req, res) => {
  try {
    const filters = {};
    
    // Check if nationality is provided in the query
    if (req.query.nationality) {
      filters.nationality = req.query.nationality; // Ensure this matches the model structure
    }
    if (req.query.dateFrom && req.query.dateTo) {
      filters.check_in = { $gte: new Date(req.query.dateFrom), $lte: new Date(req.query.dateTo) };
    }
    if (req.query.status) {
      filters.status = req.query.status;
    }

    console.log('Filters applied:', filters); // Log the filters

    // Fetch residences based on the filters
    const residences = await Residence.find(filters)
      .populate('foreignResident')
      .populate('accommodation');

    console.log('Residences found:', residences); // Log the results

    const reportData = residences.map(residence => ({
      fullName: residence.foreignResident.fullName,
      nationality: residence.foreignResident.nationality, // This assumes you still want to show the nationality from ForeignResident
      accommodation: residence.accommodation.name,
      checkIn: residence.check_in,
      checkOut: residence.check_out,
      stayDuration: residence.check_out
        ? Math.ceil((new Date(residence.check_out) - new Date(residence.check_in)) / (1000 * 60 * 60 * 24))
        : 'Ongoing',
      status: residence.status,
    }));

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');

    // Add columns to the worksheet
    worksheet.columns = [
      { header: 'Full Name', key: 'fullName', width: 20 },
      { header: 'Nationality', key: 'nationality', width: 25 },
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