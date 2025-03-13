document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('incidentForm');
    
    // Установка текущей даты по умолчанию
    const dateInput = document.getElementById('incidentDate');
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;

    // Проверяем, есть ли ID происшествия в URL (для редактирования)
    const urlParams = new URLSearchParams(window.location.search);
    const incidentId = urlParams.get('id');
    
    if (incidentId) {
        // Загружаем данные происшествия для редактирования
        loadIncidentForEdit(incidentId);
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Получение данных из формы
        const incidentData = {
            number: document.getElementById('incidentNumber').value,
            type: document.getElementById('incidentType').value,
            date: document.getElementById('incidentDate').value,
            status: document.getElementById('incidentStatus').value,
            description: document.getElementById('incidentDescription').value,
            measures: document.getElementById('incidentMeasures').value,
            responsible: document.getElementById('incidentResponsible').value
        };
        if (!validateForm(incidentData)) {
            return;
        }
        saveIncident(incidentData, incidentId);
    });
});

function loadIncidentForEdit(incidentId) {
    const incidents = JSON.parse(localStorage.getItem('incidents') || '[]');
    const incident = incidents.find(inc => inc.id === incidentId);
    
    if (incident) {
        document.getElementById('incidentNumber').value = incident.number;
        document.getElementById('incidentType').value = incident.type;
        document.getElementById('incidentDate').value = incident.date;
        document.getElementById('incidentStatus').value = incident.status;
        document.getElementById('incidentDescription').value = incident.description;
        document.getElementById('incidentMeasures').value = incident.measures || '';
        document.getElementById('incidentResponsible').value = incident.responsible || '';
        
        // Меняем заголовок формы
        document.querySelector('.create-incident-section h1').textContent = 'Редактирование происшествия';
        // Меняем текст кнопки
        document.querySelector('.btn-primary').textContent = 'Сохранить изменения';
    }
}

function validateForm(data) {
    // Проверка номера
    if (!data.number.trim()) {
        alert('Пожалуйста, введите номер происшествия');
        return false;
    }

    // Проверка типа
    if (!data.type) {
        alert('Пожалуйста, выберите тип происшествия');
        return false;
    }

    // Проверка даты
    if (!data.date) {
        alert('Пожалуйста, выберите дату');
        return false;
    }

    // Проверка статуса
    if (!data.status) {
        alert('Пожалуйста, выберите статус');
        return false;
    }

    // Проверка описания
    if (!data.description.trim()) {
        alert('Пожалуйста, введите описание происшествия');
        return false;
    }

    return true;
}

function saveIncident(data, incidentId) {
    // Получаем существующие происшествия из localStorage
    let incidents = JSON.parse(localStorage.getItem('incidents') || '[]');
    
    if (incidentId) {
        // Редактирование существующего происшествия
        const index = incidents.findIndex(inc => inc.id === incidentId);
        if (index !== -1) {
            data.id = incidentId; // Сохраняем ID
            incidents[index] = data;
        }
    } else {
        // Создание нового происшествия
        data.id = Date.now().toString(); // Генерируем уникальный ID
        incidents.push(data);
    }
    
    // Сохраняем обновленный список
    localStorage.setItem('incidents', JSON.stringify(incidents));
    
    alert(incidentId ? 'Происшествие успешно обновлено' : 'Происшествие успешно создано');
    window.location.href = 'incident.html';
} 