document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form[action="/declaration"]');
  const districtSelect = document.getElementById('district');
  const wardSelect = document.getElementById('ward');
  const declarationTableBody = document.getElementById('declarationTableBody');
  const declarationDetailContent = document.getElementById('declarationDetailContent');
  const declarationDetailModal = new bootstrap.Modal(document.getElementById('declarationDetailModal'));
  const successModal = new bootstrap.Modal(document.getElementById('successModal'));

  let districts = []; // Store districts data globally

  // Fetch districts and populate the district dropdown
  async function fetchUnits() {
    try {
      const response = await fetch('/declaration/api/units');
      if (response.ok) {
        districts = await response.json();
        districts.forEach(district => {
          const option = document.createElement('option');
          option.value = district.Code;
          option.textContent = district.FullName;
          districtSelect.appendChild(option);
        });
      } else {
        console.error('Failed to fetch units, status:', response.status);
      }
    } catch (error) {
      console.error('Error fetching units:', error);
    }
  }

  // Update wards based on selected district
  districtSelect.addEventListener('change', function () {
    const selectedDistrictCode = districtSelect.value;
    const selectedDistrictData = districts.find(d => d.Code === selectedDistrictCode);
    wardSelect.innerHTML = ''; // Clear existing options

    if (selectedDistrictData && selectedDistrictData.Ward) {
      selectedDistrictData.Ward.forEach(ward => {
        const option = document.createElement('option');
        option.value = ward.Code;
        option.textContent = ward.FullName;
        wardSelect.appendChild(option);
      });
    }
  });

  fetchUnits(); // Call the function to fetch and display units

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    const formData = new FormData(form);
    const districtText = districtSelect.options[districtSelect.selectedIndex].text;
    const wardText = wardSelect.options[wardSelect.selectedIndex].text;
    const address = formData.get('address');

    // Construct the accommodation string
    const accommodation = `${address}, ${wardText}, ${districtText}`;
    formData.set('accommodation', accommodation);

    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/declaration/api/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        successModal.show(); // Show the success modal

        // Automatically redirect after 5 seconds
        setTimeout(() => {
          window.location.href = '/declaration';
        }, 5000);

        // Redirect when modal is closed
        document.getElementById('successModal').addEventListener('hidden.bs.modal', function () {
          window.location.href = '/declaration';
        });
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error submitting declaration:', error);
      alert('An error occurred while submitting the declaration.');
    }
  });

  // Fetch and display declaration history
  async function fetchDeclarations() {
    try {
      const response = await fetch('/declaration/api');
      if (response.ok) {
        const declarations = await response.json();
        declarationTableBody.innerHTML = ''; // Clear existing data

        declarations.forEach(declaration => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${declaration.full_name}</td>
            <td>${declaration.accommodation}</td>
            <td>${new Date(declaration.check_in).toLocaleDateString()}</td>
            <td>${declaration.check_out ? new Date(declaration.check_out).toLocaleDateString() : 'N/A'}</td>
            <td>${declaration.status}</td>
          `;
          row.addEventListener('click', () => showDeclarationDetails(declaration));
          declarationTableBody.appendChild(row);
        });
      } else {
        console.error('Failed to fetch declarations');
      }
    } catch (error) {
      console.error('Error fetching declarations:', error);
    }
  }

  // Show declaration details in a modal
  function showDeclarationDetails(declaration) {
    declarationDetailContent.innerHTML = `
      <p><strong>Họ và tên:</strong> ${declaration.full_name}</p>
      <p><strong>Quốc tịch:</strong> ${declaration.nationality}</p>
      <p><strong>Nơi cư trú:</strong> ${declaration.accommodation}</p>
      <p><strong>Ngày nhận phòng:</strong> ${new Date(declaration.check_in).toLocaleDateString()}</p>
      <p><strong>Ngày trả phòng:</strong> ${declaration.check_out ? new Date(declaration.check_out).toLocaleDateString() : 'N/A'}</p>
      <p><strong>Lý do:</strong> ${declaration.reason}</p>
      <p><strong>Tình trạng:</strong> ${declaration.status}</p>
    `;
    declarationDetailModal.show();
  }

  fetchDeclarations(); // Call the function to fetch and display declarations
});
