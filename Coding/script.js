let currentLang = 'en';
let globalData = null;
let selectedCategory = 'all';

document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            globalData = data;
            renderPortfolio();
        })
        .catch(err => console.error('Data loading error:', err));
});

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'bn' : 'en';
    document.getElementById('lang-btn').innerText = currentLang === 'en' ? 'বাংলা' : 'English';
    renderPortfolio();
}

function filterCategory(catId) {
    selectedCategory = catId;
    renderPortfolio();
}

function renderPortfolio() {
    if (!globalData) return;

    // ১. প্রোফাইল ইনফো
    document.getElementById('user-avatar').src = globalData.profile.avatar;
    document.getElementById('user-name').innerText = globalData.profile.name[currentLang];
    document.getElementById('user-title').innerText = globalData.profile.title[currentLang];
    document.getElementById('user-bio').innerText = globalData.profile.bio[currentLang];

    // সোশ্যাল লিংক
    const socialsContainer = document.getElementById('social-links');
    socialsContainer.innerHTML = '';
    globalData.socials.forEach(s => {
        const link = document.createElement('a');
        link.href = s.url;
        link.target = '_blank';
        link.innerText = s.name;
        socialsContainer.appendChild(link);
    });

    // ২. ফিল্টার বাটন রেন্ডারিং
    const filterContainer = document.getElementById('filter-buttons');
    filterContainer.innerHTML = '';

    // "All" বাটন
    const allBtn = document.createElement('button');
    allBtn.className = `filter-btn ${selectedCategory === 'all' ? 'active' : ''}`;
    allBtn.innerText = currentLang === 'en' ? 'All Works' : 'সকল কাজ';
    allBtn.onclick = () => filterCategory('all');
    filterContainer.appendChild(allBtn);

    // সেকশন ভিত্তিক ফিল্টার বাটন
    globalData.sections.forEach(sec => {
        const btn = document.createElement('button');
        btn.className = `filter-btn ${selectedCategory === sec.id ? 'active' : ''}`;
        btn.innerText = sec.title[currentLang];
        btn.onclick = () => filterCategory(sec.id);
        filterContainer.appendChild(btn);
    });

    // ৩. সেকশন রেন্ডারিং (ফিল্টারিং অনুসারে)
    const sectionsContainer = document.getElementById('dynamic-sections');
    sectionsContainer.innerHTML = '';

    globalData.sections.forEach(section => {
        if (selectedCategory !== 'all' && selectedCategory !== section.id) {
            return; // নির্বাচিত ক্যাটাগরি না হলে হাইড করে রাখা
        }

        const secDiv = document.createElement('div');
        secDiv.className = 'main-section';
        secDiv.innerHTML = `<h2 class="section-title">${section.title[currentLang]}</h2>`;

        section.subsections.forEach(sub => {
            const subTitle = document.createElement('h3');
            subTitle.className = 'subsection-title';
            subTitle.innerText = sub.title[currentLang];
            secDiv.appendChild(subTitle);

            const gridDiv = document.createElement('div');
            gridDiv.className = 'grid';

            sub.items.forEach(item => {
                const card = document.createElement('div');
                card.className = 'card';

                if (item.videoUrl) {
                    card.innerHTML = `
                        <iframe src="${item.videoUrl}" allowfullscreen></iframe>
                        <div class="card-title">${item.title[currentLang]}</div>
                    `;
                } else {
                    card.innerHTML = `
                        <img src="${item.thumbnail || item.image}" alt="${item.title[currentLang]}">
                        <div class="card-title">${item.title[currentLang]}</div>
                    `;
                }
                gridDiv.appendChild(card);
            });

            secDiv.appendChild(gridDiv);
        });

        sectionsContainer.appendChild(secDiv);
    });

    // ৪. কন্টাক্ট ফর্মের লেখাগুলোর ডাইনামিক অনুবাদ
    if (currentLang === 'en') {
        document.getElementById('contact-title').innerText = 'Get In Touch';
        document.getElementById('lbl-name').innerText = 'Name';
        document.getElementById('lbl-email').innerText = 'Email';
        document.getElementById('lbl-message').innerText = 'Message';
        document.getElementById('btn-submit').innerText = 'Send Message';
    } else {
        document.getElementById('contact-title').innerText = 'যোগাযোগ করুন';
        document.getElementById('lbl-name').innerText = 'নাম';
        document.getElementById('lbl-email').innerText = 'ইমেইল';
        document.getElementById('lbl-message').innerText = 'বার্তা';
        document.getElementById('btn-submit').innerText = 'বার্তা পাঠান';
    }
}