async function loadTimezones() {
    try {
        const response = await fetch('timezones.json');
        if (!response.ok) {
            throw new Error('Failed to fetch timezones');
        }
        const timezones = await response.json();
        initializeDropdown('locationSearch1', 'timezoneDropdown1', 'leftTimezones', timezones, true);
        initializeDropdown('locationSearch2', 'timezoneDropdown2', 'rightTimezones', timezones, false);
    } catch (error) {
        console.error('Error loading timezones:', error);
    }
}
function initializeDropdown(inputId, dropdownId, containerId, timezones, singleSelection) {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);
    const container = document.getElementById(containerId);
    input.addEventListener('focus', () => {
        dropdown.classList.remove('hidden');
        filterDropdown(timezones, input.value);
    });
    input.addEventListener('input', () => {
        filterDropdown(timezones, input.value.toLowerCase());
    });
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && e.target !== input) {
            dropdown.classList.add('hidden');
        }
    });    
    function filterDropdown(data, query) {
        dropdown.innerHTML = '';
        const filtered = data.filter(zone =>
            zone.text.toLowerCase().includes(query) ||
            zone.utc.some(city => city.toLowerCase().includes(query))
        );
        if (filtered.length === 0) {
            const noResult = document.createElement('li');
            noResult.textContent = 'No results found';
            noResult.style.color = 'gray';
            dropdown.appendChild(noResult);
        } else {
            filtered.forEach(zone => {
                const item = document.createElement('li');
                item.textContent = zone.text;
                const addButton = document.createElement('button');
                addButton.textContent = '+';
                addButton.addEventListener('click', () => {
                    addTimezone(zone, containerId, singleSelection);
                    dropdown.classList.add('hidden');
                });
                item.appendChild(addButton);
                dropdown.appendChild(item);
            });
        }
    }
}
function addTimezone(zone, containerId, singleSelection) {
    const container = document.getElementById(containerId);
    if (containerId === 'leftTimezones') {
        const selectedTimezoneContainer = document.getElementById('selectedTimezone');
        selectedTimezoneContainer.style.display = 'block';
        const currentTime = getCurrentTime(zone.offset);
        selectedTimezoneContainer.dataset.offset = zone.offset; 
        selectedTimezoneContainer.innerHTML = `
            ${zone.text}
            <p>Current Time: ${currentTime}</p>
        `;
    } else {
        if (!singleSelection && container.querySelector(`[data-value="${zone.value}"]`)) {
            alert('This timezone is already added.');
            return;
        }
        const timezoneDiv = document.createElement('div');
        timezoneDiv.className = 'timezone-item';
        timezoneDiv.setAttribute('data-value', zone.value);
        timezoneDiv.setAttribute('data-offset', zone.offset);
        const currentTime = getCurrentTime(zone.offset);
        timezoneDiv.innerHTML = `
            ${zone.text}
            <p>Current Time: ${currentTime}</p>
        `;
        container.appendChild(timezoneDiv);
    }
}
function getCurrentTime(offset) {  // (doesn't include DST adjustment)
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const localTime = new Date(utc + offset * 3600000);
    return localTime.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
}
function populateMeetingTimeDropdown() {
    const meetingTimeDropdown = document.getElementById('meetingTime');
    for (let hour = 0; hour < 24; hour++) {
        const formattedHour = hour.toString().padStart(2, '0');
        const option = document.createElement('option');
        option.value = `${formattedHour}:00`;
        option.textContent = `${formattedHour}:00`;
        meetingTimeDropdown.appendChild(option);
    }
}
document.getElementById('updateButton').addEventListener('click', function () {
    const proposedTime = document.getElementById('meetingTime').value;
    const leftTimezone = document.getElementById('selectedTimezone');
    const offset = leftTimezone.dataset.offset;
    updateRightTimezones(proposedTime, offset);
});
function updateRightTimezones(proposedTime, leftOffset) {
    const rightTimezones = document.querySelectorAll('.right-timezones .timezone-item');
    rightTimezones.forEach((timezoneDiv) => {
        const offset = timezoneDiv.getAttribute('data-offset');
        const correspondingTime = calculateCorrespondingTime(proposedTime, leftOffset, offset);
        let proposedTimeLine = timezoneDiv.querySelector('.proposed-time');
        if (!proposedTimeLine) {
            proposedTimeLine = document.createElement('p');
            proposedTimeLine.classList.add('proposed-time');
            timezoneDiv.appendChild(proposedTimeLine);
        }
        proposedTimeLine.textContent = `At the proposed time it will be: ${correspondingTime}`;
    });
}
function calculateCorrespondingTime(proposedTime, leftOffset, rightOffset) { // (also doesn't include DST adjustment)
    const [hours, minutes] = proposedTime.split(':').map(Number);
    const now = new Date();
    now.setHours(hours, minutes, 0);
    const utcTime = now.getTime() - leftOffset * 3600000;
    const localTime = new Date(utcTime + rightOffset * 3600000);
    return localTime.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
}
loadTimezones();
populateMeetingTimeDropdown();

