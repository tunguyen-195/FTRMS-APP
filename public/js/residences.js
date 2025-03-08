document.addEventListener('DOMContentLoaded', function () {
  const csrfMetaTag = document.querySelector('meta[name="csrf-token"]');
  const csrfToken = csrfMetaTag ? csrfMetaTag.getAttribute('content') : null;

  if (!csrfToken) {
    console.error('CSRF token not found in meta tag');
    return; // Exit if CSRF token is not found
  }

  const districtSelect = document.getElementById('district');
  const wardSelect = document.getElementById('ward');
  const approveButtons = document.querySelectorAll('.btn-success');
  const rejectButtons = document.querySelectorAll('.btn-danger');

  let districts = []; // Store districts data globally

  // Fetch districts and populate the district dropdown
  // async function fetchUnits() {
  //   try {
  //     const response = await fetch('/declaration/api/units');
  //     if (response.ok) {
  //       districts = await response.json(); // Store the districts data
  //       districts.forEach(district => {
  //         const option = document.createElement('option');
  //         option.value = district.Code;
  //         option.textContent = district.FullName;
  //         districtSelect.appendChild(option);
  //       });
  //     } else {
  //       console.error('Failed to fetch units');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching units:', error);
  //   }
  // }

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

  // Attach event listeners to buttons
  approveButtons.forEach(button => {
    button.addEventListener('click', function () {
      const declarationId = this.getAttribute('data-id');
      const newStatus = this.getAttribute('data-status');
      updateStatus(declarationId, newStatus);
    });
  });

  rejectButtons.forEach(button => {
    button.addEventListener('click', function () {
      const declarationId = this.getAttribute('data-id');
      const newStatus = this.getAttribute('data-status');
      updateStatus(declarationId, newStatus);
    });
  });

  fetchUnits(); // Call the function to fetch and display units

  function updateStatus(declarationId, newStatus) {

    fetch(`/residences/${declarationId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': csrfToken // Include CSRF token in headers
      },
      body: JSON.stringify({ status: newStatus }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log(data)
        location.reload(); // Reload the page to reflect changes
      } else {
        console.error(`Error updating status for declaration ID: ${declarationId}`, data.message);
        alert('Error updating status');
      }
    })
    .catch(error => console.error('Error:', error));
  }

  const $ = document.querySelector.bind(document);
  const $$ = document.querySelectorAll.bind(document);

  const tabs = $$(".tab-item");
  const panes = $$(".tab-pane");

  const tabActive = $(".tab-item.active");
  const line = $(".tabs .line");

  requestIdleCallback(function () {
    line.style.left = tabActive.offsetLeft + "px";
    line.style.width = tabActive.offsetWidth + "px";
  });

  tabs.forEach((tab, index) => {
    const pane = panes[index];

    tab.onclick = function () {
      $(".tab-item.active").classList.remove("active");
      $(".tab-pane.active").classList.remove("active");

      line.style.left = this.offsetLeft + "px";
      line.style.width = this.offsetWidth + "px";

      this.classList.add("active");
      pane.classList.add("active");
    };
  });
});