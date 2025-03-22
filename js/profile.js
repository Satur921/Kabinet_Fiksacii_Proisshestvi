document.addEventListener('DOMContentLoaded', function() {
    const viewMode = document.querySelector('.view-mode');
    const editMode = document.querySelector('.edit-mode');
    const editButton = document.getElementById('edit-profile-btn');
    const cancelButton = document.querySelector('.cancel-edit-btn');
    const profileForm = document.getElementById('profileForm');

    // Загрузка данных профиля
    function loadProfile() {
        const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
        
        // Заполняем поля просмотра
        document.getElementById('view-firstName').textContent = profile.firstName || 'Не указано';
        document.getElementById('view-lastName').textContent = profile.lastName || 'Не указано';
        document.getElementById('view-position').textContent = profile.position || 'Не указано';
        document.getElementById('view-phone').textContent = profile.phone || 'Не указано';
        document.getElementById('view-email').textContent = profile.email || 'Не указано';

        // Заполняем поля редактирования
        document.getElementById('firstName').value = profile.firstName || '';
        document.getElementById('lastName').value = profile.lastName || '';
        document.getElementById('position').value = profile.position || '';
        document.getElementById('phone').value = profile.phone || '';
        document.getElementById('email').value = profile.email || '';
    }

    // Переключение в режим редактирования
    editButton.addEventListener('click', () => {
        viewMode.style.display = 'none';
        editMode.style.display = 'block';
    });

    // Отмена редактирования
    cancelButton.addEventListener('click', () => {
        viewMode.style.display = 'block';
        editMode.style.display = 'none';
        loadProfile(); // Загружаем исходные данные
    });

    // Сохранение профиля
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const profile = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            position: document.getElementById('position').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value
        };

        // Сохраняем в localStorage
        localStorage.setItem('userProfile', JSON.stringify(profile));

        // Переключаемся обратно в режим просмотра
        viewMode.style.display = 'block';
        editMode.style.display = 'none';
        loadProfile();
    });

    // Начальная загрузка данных
    loadProfile();
}); 