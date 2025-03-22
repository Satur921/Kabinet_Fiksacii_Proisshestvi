document.addEventListener('DOMContentLoaded', function() {
    console.log('Скрипт загружен');

    // Функция для форматирования даты
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Функция для получения происшествий за последние 24 часа
    function getLast24HoursIncidents() {
        const incidents = JSON.parse(localStorage.getItem('incidents') || '[]');
        console.log('Получены происшествия:', incidents);
        const now = new Date();
        const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const filteredIncidents = incidents.filter(incident => {
            const incidentDate = new Date(incident.date);
            return incidentDate >= last24Hours;
        });
        console.log('Отфильтрованные происшествия:', filteredIncidents);
        return filteredIncidents;
    }

    // Функция для обновления карточек с последними происшествиями
    function updateLastIncidents() {
        console.log('Начало обновления карточек');
        const lastIncidents = getLast24HoursIncidents();
        const container = document.getElementById('incidents-container');
        
        if (!container) {
            console.error('Контейнер не найден');
            return;
        }

        // Очищаем контейнер
        container.innerHTML = '';

        if (lastIncidents.length === 0) {
            container.innerHTML = '<div class="col-12"><p class="text-center">За последние 24 часа происшествий не было</p></div>';
            return;
        }

        // Сортируем по дате (новые сверху)
        lastIncidents.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Создаем карточки
        lastIncidents.forEach(incident => {
            console.log('Создание карточки для происшествия:', incident);
            
            // Создаем новую карточку
            const card = document.createElement('div');
            card.className = 'col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3 col-xxl-2';
            
            card.innerHTML = `
                <div class="card-incident">
                    <div class="text-center">
                        <b>Происшествие №<span class="incident-number">${incident.number}</span></b>
                        <div class="card-incident_info-block">
                            <p>Тип: <span class="incident-type">${incident.type}</span></p>
                            <p>Дата: <span class="incident-date">${formatDate(incident.date)}</span></p>
                            <p>Статус: <span class="incident-status ${incident.status === 'активно' ? 'status-active' : 'status-completed'}">${incident.status}</span></p>
                        </div>
                    </div>
                </div>
            `;
            
            container.appendChild(card);
        });
        console.log('Карточки обновлены');
    }

    // Обновляем карточки при загрузке страницы
    updateLastIncidents();

    // Слушаем изменения в localStorage
    window.addEventListener('storage', function(e) {
        console.log('Изменение в localStorage:', e.key);
        if (e.key === 'incidents') {
            updateLastIncidents();
        }
    });
}); 