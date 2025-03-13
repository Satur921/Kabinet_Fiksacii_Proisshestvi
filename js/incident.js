// script.js
document.addEventListener('DOMContentLoaded', function () {
    const typeFilter = document.getElementById('type-filter');
    const descriptionSearch = document.getElementById('description-search');
    const incidentsTable = document.getElementById('incidents-table').getElementsByTagName('tbody')[0];
    const mobileTableBody = document.querySelector('.mobile-table-body');
    const createButton = document.getElementById('create-button');
    const modal = new bootstrap.Modal(document.getElementById('incidentModal'));
    const editButton = document.getElementById('edit-incident-btn');
    const saveButton = document.getElementById('save-incident-btn');
    const viewMode = document.querySelector('.view-mode');
    const editMode = document.querySelector('.edit-mode');
    let currentIncident = null;

    // Загрузка и отображение происшествий
    function loadIncidents() {
        const incidents = JSON.parse(localStorage.getItem('incidents') || '[]');
        displayIncidents(incidents);
    }

    // Отображение происшествий в таблице
    function displayIncidents(incidents) {
        // Очистка таблиц
        incidentsTable.innerHTML = '';
        mobileTableBody.innerHTML = '';

        incidents.forEach(incident => {
            // Создание строки для десктопной таблицы
            const row = incidentsTable.insertRow();
            row.innerHTML = `
                <td>${incident.number}</td>
                <td>${incident.type}</td>
                <td>${formatDate(incident.date)}</td>
                <td class="status-${incident.status === 'активно' ? 'active' : 'completed'}">${incident.status}</td>
                <td>${incident.description}</td>
            `;

            // Создание карточки для мобильной таблицы
            const mobileItem = document.createElement('div');
            mobileItem.className = 'mobile-table-item';
            mobileItem.innerHTML = `
                <div class="mobile-table-header">
                    <span>Описание</span>
                    <span>Статус</span>
                </div>
                <div class="mobile-table-divider"></div>
                <div class="mobile-table-content">
                    <div class="content-description">
                        <div class="number-row">${incident.number}</div>
                        <div class="info-row">${formatDate(incident.date)}</div>
                        <div class="info-row">${incident.type}</div>
                        <div class="info-row">${incident.description}</div>
                    </div>
                    <div class="content-status">
                        <span class="status-${incident.status === 'активно' ? 'active' : 'completed'}">${incident.status}</span>
                    </div>
                </div>
            `;

            // Добавление обработчиков клика
            row.addEventListener('click', () => showIncidentDetails(incident));
            mobileItem.addEventListener('click', () => showIncidentDetails(incident));

            mobileTableBody.appendChild(mobileItem);
        });
    }

    // Форматирование даты
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    }

    // Показ деталей происшествия в модальном окне
    function showIncidentDetails(incident) {
        currentIncident = incident; // Сохраняем текущее происшествие
        document.getElementById('modal-number').textContent = incident.number;
        document.getElementById('modal-type').textContent = incident.type;
        document.getElementById('modal-date').textContent = formatDate(incident.date);
        document.getElementById('modal-status').textContent = incident.status;
        document.getElementById('modal-description').textContent = incident.description;
        document.getElementById('modal-measures').textContent = incident.measures || 'Не указаны';
        document.getElementById('modal-responsible').textContent = incident.responsible || 'Не указан';
        
        // Заполняем поля редактирования
        document.getElementById('edit-number').value = incident.number;
        document.getElementById('edit-type').value = incident.type;
        document.getElementById('edit-date').value = incident.date;
        document.getElementById('edit-status').value = incident.status;
        document.getElementById('edit-description').value = incident.description;
        document.getElementById('edit-measures').value = incident.measures || '';
        document.getElementById('edit-responsible').value = incident.responsible || '';
        
        // Показываем режим просмотра
        viewMode.style.display = 'block';
        editMode.style.display = 'none';
        editButton.style.display = 'block';
        saveButton.style.display = 'none';
        
        modal.show();
    }

    // Обработчик кнопки редактирования
    editButton.addEventListener('click', () => {
        if (currentIncident) {
            // Переключаемся в режим редактирования
            viewMode.style.display = 'none';
            editMode.style.display = 'block';
            editButton.style.display = 'none';
            saveButton.style.display = 'block';
        }
    });

    // Обработчик кнопки сохранения
    saveButton.addEventListener('click', () => {
        if (currentIncident) {
            // Получаем обновленные данные
            const updatedIncident = {
                ...currentIncident,
                number: document.getElementById('edit-number').value,
                type: document.getElementById('edit-type').value,
                date: document.getElementById('edit-date').value,
                status: document.getElementById('edit-status').value,
                description: document.getElementById('edit-description').value,
                measures: document.getElementById('edit-measures').value,
                responsible: document.getElementById('edit-responsible').value
            };

            // Обновляем данные в localStorage
            const incidents = JSON.parse(localStorage.getItem('incidents') || '[]');
            const updatedIncidents = incidents.map(incident => 
                incident.number === currentIncident.number ? updatedIncident : incident
            );
            localStorage.setItem('incidents', JSON.stringify(updatedIncidents));

            // Обновляем текущее происшествие
            currentIncident = updatedIncident;

            // Переключаемся обратно в режим просмотра
            showIncidentDetails(updatedIncident);
            
            // Обновляем таблицу
            loadIncidents();
        }
    });

    // Обработчик кнопки удаления
    document.getElementById('delete-incident-btn').addEventListener('click', function() {
        if (currentIncident) {
            if (confirm('Вы уверены, что хотите удалить это происшествие?')) {
                const incidents = JSON.parse(localStorage.getItem('incidents') || '[]');
                const updatedIncidents = incidents.filter(incident => incident.number !== currentIncident.number);
                localStorage.setItem('incidents', JSON.stringify(updatedIncidents));
                
                // Закрываем модальное окно
                const modal = bootstrap.Modal.getInstance(document.getElementById('incidentModal'));
                modal.hide();
                
                // Обновляем таблицу
                loadIncidents();
            }
        }
    });

    // Фильтрация происшествий
    function filterIncidents() {
        const selectedType = typeFilter.value;
        const searchText = descriptionSearch.value.toLowerCase();
        const incidents = JSON.parse(localStorage.getItem('incidents') || '[]');

        const filteredIncidents = incidents.filter(incident => {
            const matchesType = !selectedType || incident.type === selectedType;
            const matchesSearch = !searchText || 
                incident.description.toLowerCase().includes(searchText) ||
                incident.number.toLowerCase().includes(searchText);
            return matchesType && matchesSearch;
        });

        displayIncidents(filteredIncidents);
    }

    // Обработчики событий
    typeFilter.addEventListener('change', filterIncidents);
    descriptionSearch.addEventListener('input', filterIncidents);

    // Кнопка "Создать"
    createButton.addEventListener('click', () => {
        window.location.href = 'create_incident.html';
    });

    // Начальная загрузка данных
    loadIncidents();
});