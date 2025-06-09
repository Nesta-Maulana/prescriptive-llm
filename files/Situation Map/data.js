let map;
let heatmapLayer;
let heatmapLayers = {};
let markerGroup;
let activeCategory = null;
let currentMapStyle = 0;
let currentZoom = 6;
let dateFilter = { start: null, end: null };

const mapStyles = [
    {
        name: 'Dark Theme',
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        attribution: '© OpenStreetMap contributors © CARTO'
    },
    {
        name: 'Default',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '© OpenStreetMap contributors'
    },
    {
        name: 'Satellite',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: '© Esri'
    }
];

//Dummy data for Indonesia locations
const indonesiaLocations = [
    // Jakarta
    { lat: -6.2088, lng: 106.8456, intensity: 1.0, tag: 'teroris', date: '2025-01-15', mainLocation: 'Jakarta', desc: 'Penangkapan kelompok teroris di pusat kota Jakarta.' },
    { lat: -6.1751, lng: 106.8270, intensity: 0.9, tag: 'spionase', date: '2025-01-20', mainLocation: 'Jakarta', desc: 'Kasus spionase data pemerintah di Jakarta Pusat.' },
    { lat: -6.1995, lng: 106.8167, intensity: 0.8, tag: 'separatisme', date: '2025-02-10', mainLocation: 'Jakarta', desc: 'Aksi separatisme di kawasan Jakarta Barat.' },
    { lat: -6.2100, lng: 106.8300, intensity: 0.7, tag: 'sabotase', date: '2025-02-25', mainLocation: 'Jakarta', desc: 'Sabotase jaringan listrik di Jakarta Selatan.' },

    // Surabaya
    { lat: -7.2575, lng: 112.7521, intensity: 0.95, tag: 'separatisme', date: '2025-01-25', mainLocation: 'Surabaya', desc: 'Aksi separatisme di wilayah Surabaya Timur.' },
    { lat: -7.2655, lng: 112.7421, intensity: 0.85, tag: 'teroris', date: '2025-02-05', mainLocation: 'Surabaya', desc: 'Penggerebekan sel teroris di Surabaya.' },
    { lat: -7.2700, lng: 112.7500, intensity: 0.8, tag: 'spionase', date: '2025-02-15', mainLocation: 'Surabaya', desc: 'Kasus spionase industri di Surabaya Utara.' },
    { lat: -7.2800, lng: 112.7600, intensity: 0.75, tag: 'sabotase', date: '2025-03-01', mainLocation: 'Surabaya', desc: 'Sabotase fasilitas air di Surabaya Barat.' },

    // Medan
    { lat: 3.5952, lng: 98.6722, intensity: 0.8, tag: 'sabotase', date: '2025-01-30', mainLocation: 'Medan', desc: 'Upaya sabotase fasilitas umum di Medan.' },
    { lat: 3.6052, lng: 98.6822, intensity: 0.6, tag: 'separatisme', date: '2025-02-08', mainLocation: 'Medan', desc: 'Aksi separatisme di Medan Utara.' },
    { lat: 3.6100, lng: 98.6900, intensity: 0.7, tag: 'teroris', date: '2025-02-18', mainLocation: 'Medan', desc: 'Penangkapan terduga teroris di Medan.' },
    { lat: 3.6200, lng: 98.7000, intensity: 0.65, tag: 'spionase', date: '2025-03-05', mainLocation: 'Medan', desc: 'Kasus spionase data pemerintah di Medan.' },

    // Makassar
    { lat: -5.1477, lng: 119.4327, intensity: 0.7, tag: 'sabotase', date: '2025-01-18', mainLocation: 'Makassar', desc: 'Sabotase jaringan listrik di Makassar.' },
    { lat: -5.1577, lng: 119.4427, intensity: 0.6, tag: 'teroris', date: '2025-02-03', mainLocation: 'Makassar', desc: 'Penangkapan terduga teroris di Makassar.' },
    { lat: -5.1677, lng: 119.4527, intensity: 0.65, tag: 'spionase', date: '2025-02-20', mainLocation: 'Makassar', desc: 'Kasus spionase industri di Makassar.' },
    { lat: -5.1777, lng: 119.4627, intensity: 0.6, tag: 'separatisme', date: '2025-03-10', mainLocation: 'Makassar', desc: 'Aksi separatisme di Makassar Selatan.' },

    // Bandung
    { lat: -6.9175, lng: 107.6191, intensity: 0.9, tag: 'teroris', date: '2025-01-22', mainLocation: 'Bandung', desc: 'Rencana aksi teror di pusat perbelanjaan Bandung.' },
    { lat: -6.9275, lng: 107.6291, intensity: 0.85, tag: 'spionase', date: '2025-02-05', mainLocation: 'Bandung', desc: 'Kasus spionase data pemerintah di Bandung Utara.' },
    { lat: -6.9375, lng: 107.6391, intensity: 0.8, tag: 'sabotase', date: '2025-02-15', mainLocation: 'Bandung', desc: 'Sabotase fasilitas air di Bandung Timur.' },
    { lat: -6.9475, lng: 107.6491, intensity: 0.75, tag: 'separatisme', date: '2025-03-01', mainLocation: 'Bandung', desc: 'Aksi separatisme di Bandung Selatan.' },

    // Denpasar
    { lat: -8.6705, lng: 115.2126, intensity: 0.8, tag: 'teroris', date: '2025-01-28', mainLocation: 'Denpasar', desc: 'Kasus spionase turis asing di Denpasar.' },
    { lat: -8.6905, lng: 115.2026, intensity: 0.4, tag: 'teroris', date: '2025-02-17', mainLocation: 'Denpasar', desc: 'Upaya sabotase jaringan air di Denpasar.' },
    { lat: -8.7005, lng: 115.1926, intensity: 0.6, tag: 'teroris', date: '2025-02-25', mainLocation: 'Denpasar', desc: 'Penangkapan jaringan teroris yang menyamar sebagai wisatawan di Denpasar.' },
    { lat: -8.6805, lng: 115.2226, intensity: 0.5, tag: 'teroris', date: '2025-03-05', mainLocation: 'Denpasar', desc: 'Demo kecil terkait gerakan separatisme di Denpasar Utara.' },

    // Yogyakarta
    { lat: -7.7971, lng: 110.3688, intensity: 1.0, tag: 'teroris', date: '2025-02-20', mainLocation: 'Yogyakarta', desc: 'Penangkapan jaringan teroris di Yogyakarta.' },
    { lat: -7.8071, lng: 110.3788, intensity: 0.95, tag: 'teroris', date: '2025-02-21', mainLocation: 'Yogyakarta', desc: 'Aksi teror gagal di Yogyakarta Selatan.' },
    { lat: -7.8171, lng: 110.3588, intensity: 0.9, tag: 'separatisme', date: '2025-02-22', mainLocation: 'Yogyakarta', desc: 'Demo separatisme di Yogyakarta.' },
    { lat: -7.8271, lng: 110.3688, intensity: 0.7, tag: 'spionase', date: '2025-02-28', mainLocation: 'Yogyakarta', desc: 'Penyelidikan kasus spionase akademik di universitas Yogyakarta.' },

    // Semarang
    { lat: -6.9932, lng: 110.4203, intensity: 0.85, tag: 'spionase', date: '2025-02-23', mainLocation: 'Semarang', desc: 'Penyelidikan spionase di Semarang.' },
    { lat: -7.0032, lng: 110.4303, intensity: 0.8, tag: 'spionase', date: '2025-02-24', mainLocation: 'Semarang', desc: 'Sabotase fasilitas air di Semarang.' },
    { lat: -7.0132, lng: 110.4403, intensity: 0.75, tag: 'spionase', date: '2025-03-02', mainLocation: 'Semarang', desc: 'Penangkapan sel teroris kecil di pinggiran kota Semarang.' },
    { lat: -7.0232, lng: 110.4503, intensity: 0.7, tag: 'spionase', date: '2025-03-04', mainLocation: 'Semarang', desc: 'Demonstrasi separatisme di Semarang Barat.' },

    // Palembang
    { lat: -2.9861, lng: 104.7854, intensity: 0.6, tag: 'spionase', date: '2025-02-27', mainLocation: 'Palembang', desc: 'Kasus spionase industri di Palembang.' },
    { lat: -2.9961, lng: 104.7654, intensity: 0.5, tag: 'sabotase', date: '2025-02-28', mainLocation: 'Palembang', desc: 'Sabotase pabrik di Palembang.' },
    { lat: -2.9761, lng: 104.7754, intensity: 0.65, tag: 'teroris', date: '2025-03-03', mainLocation: 'Palembang', desc: 'Terduga jaringan teroris ditemukan di Palembang Timur.' },
    { lat: -2.9661, lng: 104.7554, intensity: 0.6, tag: 'separatisme', date: '2025-03-06', mainLocation: 'Palembang', desc: 'Tindakan separatis kecil terjadi di Palembang Selatan.' },

    // Balikpapan
    { lat: -1.2379, lng: 116.8529, intensity: 0.4, tag: 'teroris', date: '2025-03-01', mainLocation: 'Balikpapan', desc: 'Penangkapan teroris di Balikpapan.' },
    { lat: -1.2479, lng: 116.8629, intensity: 0.3, tag: 'separatisme', date: '2025-03-02', mainLocation: 'Balikpapan', desc: 'Aksi separatisme di Balikpapan.' },
    { lat: -1.2579, lng: 116.8729, intensity: 0.5, tag: 'spionase', date: '2025-03-05', mainLocation: 'Balikpapan', desc: 'Penyelidikan atas kasus spionase korporat di Balikpapan.' },
    { lat: -1.2679, lng: 116.8829, intensity: 0.4, tag: 'sabotase', date: '2025-03-08', mainLocation: 'Balikpapan', desc: 'Sabotase terhadap infrastruktur pelabuhan di Balikpapan.' },

    // Manado
    { lat: 1.4748, lng: 124.8421, intensity: 0.5, tag: 'spionase', date: '2025-03-03', mainLocation: 'Manado', desc: 'Penggerebekan kelompok teroris di Manado.' },
    { lat: 1.4848, lng: 124.8521, intensity: 0.55, tag: 'spionase', date: '2025-03-06', mainLocation: 'Manado', desc: 'Aktivitas spionase asing yang melibatkan pelajar di Manado.' },
    { lat: 1.4948, lng: 124.8621, intensity: 0.6, tag: 'spionase', date: '2025-03-09', mainLocation: 'Manado', desc: 'Sabotase terhadap jaringan komunikasi di Manado.' },
    { lat: 1.5048, lng: 124.8721, intensity: 0.7, tag: 'spionase', date: '2025-03-10', mainLocation: 'Manado', desc: 'Demo separatis kecil di Manado Timur.' },

    // Ambon
    { lat: -3.6954, lng: 128.1814, intensity: 0.8, tag: 'spionase', date: '2025-03-06', mainLocation: 'Ambon', desc: 'Kasus spionase di Ambon.' },
    { lat: -3.7054, lng: 128.1914, intensity: 0.9, tag: 'separatisme', date: '2025-03-07', mainLocation: 'Ambon', desc: 'Aksi separatisme di Ambon.' },
    { lat: -3.7154, lng: 128.1714, intensity: 1.0, tag: 'teroris', date: '2025-03-08', mainLocation: 'Ambon', desc: 'Penangkapan teroris di Ambon.' },
    { lat: -3.7254, lng: 128.1614, intensity: 0.7, tag: 'sabotase', date: '2025-03-10', mainLocation: 'Ambon', desc: 'Sabotase pasokan logistik di Ambon Timur.' },

    // Jayapura
    { lat: -2.5537, lng: 140.7081, intensity: 0.6, tag: 'separatisme', date: '2025-03-11', mainLocation: 'Jayapura', desc: 'Sabotase jaringan air di Jayapura.' },
    { lat: -2.5437, lng: 140.6981, intensity: 0.7, tag: 'separatisme', date: '2025-03-14', mainLocation: 'Jayapura', desc: 'Aksi separatis besar di Jayapura Utara.' },
    { lat: -2.5337, lng: 140.6881, intensity: 0.8, tag: 'separatisme', date: '2025-03-16', mainLocation: 'Jayapura', desc: 'Penangkapan tokoh penting jaringan teroris di Jayapura.' },
    { lat: -2.5637, lng: 140.7281, intensity: 0.65, tag: 'teroris', date: '2025-03-18', mainLocation: 'Jayapura', desc: 'Investigasi spionase asing di Jayapura.' },

    // Pontianak
    { lat: -0.0263, lng: 109.3425, intensity: 0.9, tag: 'teroris', date: '2025-03-12', mainLocation: 'Pontianak', desc: 'Penangkapan kelompok teroris di Pontianak.' },
    { lat: -0.0363, lng: 109.3525, intensity: 0.8, tag: 'spionase', date: '2025-03-13', mainLocation: 'Pontianak', desc: 'Kasus spionase di Pontianak.' },
    { lat: -0.0463, lng: 109.3325, intensity: 0.7, tag: 'separatisme', date: '2025-03-14', mainLocation: 'Pontianak', desc: 'Aksi separatisme di Pontianak.' },
    { lat: -0.0563, lng: 109.3625, intensity: 0.6, tag: 'sabotase', date: '2025-03-15', mainLocation: 'Pontianak', desc: 'Sabotase fasilitas minyak di Pontianak Selatan.' }
];

function getMainLocations() {
    return getFilteredData().map(loc => ({
        name: loc.mainLocation,
        coords: [loc.lat, loc.lng],
        type: loc.tag
    }));
}

function initMap() {
    try {
        map = L.map('map', {
            center: [-2.5, 118.0], // Center of Indonesia
            zoom: 5,
            zoomControl: true,
            scrollWheelZoom: true,
            doubleClickZoom: true,
            dragging: true
        });

        updateMapStyle();
        createHeatmapLayer();
        createCategoryLayers();
        createMarkerGroup();
        updateCategoryCounts();
        updateVisiblePoints();
        setDefaultDateRange();

        map.on('zoomend', handleZoomChange);

        document.getElementById('loading').style.display = 'none';
    } catch (error) {
        console.error('Error initializing map:', error);
        document.getElementById('loading').innerHTML = '<p style="color: red;">Error loading map resources</p>';
    }
}

function toggleFilterPanel() {
    const panel = document.getElementById('control-panel');
    panel.classList.toggle('hidden');
}

function setDefaultDateRange() {
    const today = new Date();
    const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    document.getElementById('start-date').value = oneMonthAgo.toISOString().split('T')[0];
    document.getElementById('end-date').value = today.toISOString().split('T')[0];
}

function createHeatmapLayer() {
    const allData = getFilteredData().map(loc => [loc.lat, loc.lng, loc.intensity]);

    // Create a default gray heatmap
    heatmapLayer = L.heatLayer(allData, {
        radius: 25,
        blur: 5,
        maxZoom: 17,
        max: 1.0,
        minOpacity: 0.6,
        gradient: {
            0.0: '#000080',
            0.2: '#0000ff',
            0.4: '#00ffff',
            0.6: '#00ff00',
            0.8: '#ffff00',
            1.0: '#ff0000'
        }
    }).addTo(map);
}

function createCategoryLayers() {
    const categoryColors = {
        teroris: '#ff4444',
        spionase: '#44ff44',
        separatisme: '#ffff44',
        sabotase: '#4444ff',
        infiltrasi: '#ff44ff',
        cyber: '#44ffff'
    };

    Object.keys(categoryColors).forEach(category => {
        const categoryData = getFilteredData()
            .filter(loc => loc.tag === category)
            .map(loc => [loc.lat, loc.lng, loc.intensity]);

        const color = categoryColors[category];
        heatmapLayers[category] = L.heatLayer(categoryData, {
            radius: 25,
            blur: 5, // Reduced blur for more solid appearance
            maxZoom: 17,
            max: 1.0,
            minOpacity: 0.7, // Increased opacity for more solid appearance
            gradient: { 0.1: color, 0.9: color } // More solid color
        });
    });
}

function createMarkerGroup() {
    markerGroup = L.layerGroup();

    getMainLocations().forEach(location => {
        const data = indonesiaLocations.find(
            d => d.lat === location.coords[0] && d.lng === location.coords[1] && d.tag === location.type
        );

        const desc = data && data.desc ? data.desc : 'Tidak ada deskripsi.';

        const customIcon = L.divIcon({
            html: `
                <div class="custom-marker">
                    <div class="marker-pulse"></div>
                    <span class="material-symbols-outlined marker-core" style="color: #ff0000; font-size: 28px;">
                        location_on
                    </span>
                </div>
            `,
            className: 'custom-marker-container',
            iconSize: [28, 28],
            iconAnchor: [14, 28]
        });

        const marker = L.marker(location.coords, { icon: customIcon })
            .bindPopup(`
                <div style="color: #00ffff; padding: 5px;">
                    <b>${location.name}</b><br>
                    <span style="color: #ffffff;">Tag: ${location.type}</span><br>
                    <span style="color: #ffffff;">Lat: ${location.coords[0]}</span><br>
                    <span style="color: #ffffff;">Lng: ${location.coords[1]}</span><br>
                    <span style="color: #ffffff;">Waktu: ${data ? data.date : '-'}</span><br>
                    <span style="color: #ffffff;">Deskripsi: ${desc}</span>
                </div>
            `)
            .on('click', function () {
                map.setView(location.coords, 14);
            });

        markerGroup.addLayer(marker);
    });

    // handleZoomChange();
}

// Handle zoom changes to toggle between heatmap and markers
function handleZoomChange() {
    currentZoom = map.getZoom();

    if (currentZoom >= 14) {
        // Tampilkan marker, sembunyikan semua heatmap
        if (!map.hasLayer(markerGroup)) {
            map.addLayer(markerGroup);
        }
        if (map.hasLayer(heatmapLayer)) {
            map.removeLayer(heatmapLayer);
        }
        Object.values(heatmapLayers).forEach(layer => {
            if (map.hasLayer(layer)) {
                map.removeLayer(layer);
            }
        });
    } else {
        // Tampilkan heatmap sesuai filter, sembunyikan marker
        if (map.hasLayer(markerGroup)) {
            map.removeLayer(markerGroup);
        }
        // Hanya tampilkan heatmap yang sesuai filter
        if (activeCategory) {
            Object.entries(heatmapLayers).forEach(([cat, layer]) => {
                if (cat === activeCategory) {
                    if (!map.hasLayer(layer)) map.addLayer(layer);
                } else {
                    if (map.hasLayer(layer)) map.removeLayer(layer);
                }
            });
            if (map.hasLayer(heatmapLayer)) map.removeLayer(heatmapLayer);
        } else {
            if (!map.hasLayer(heatmapLayer)) map.addLayer(heatmapLayer);
            Object.values(heatmapLayers).forEach(layer => {
                if (map.hasLayer(layer)) map.removeLayer(layer);
            });
        }
    }
}

function getFilteredData() {
    let filteredData = indonesiaLocations;

    if (dateFilter.start && dateFilter.end) {
        filteredData = filteredData.filter(loc => {
            const locDate = new Date(loc.date);
            return locDate >= new Date(dateFilter.start) && locDate <= new Date(dateFilter.end);
        });
    }

    // Filter kategori/tag
    if (activeCategory) {
        filteredData = filteredData.filter(loc => loc.tag === activeCategory);
    }

    return filteredData;
}

function updateCategoryCounts() {
    const counts = {
        teroris: 0,
        spionase: 0,
        separatisme: 0,
        sabotase: 0,
        infiltrasi: 0,
        cyber: 0
    };

    const filteredData = getFilteredData();
    filteredData.forEach(loc => {
        if (counts.hasOwnProperty(loc.tag)) {
            counts[loc.tag]++;
        }
    });

    Object.keys(counts).forEach(category => {
        const element = document.getElementById(`count-${category}`);
        if (element) {
            element.textContent = counts[category];
        }
    });

    document.getElementById('total-events').textContent = filteredData.length;
}

function updateVisiblePoints() {
    const filteredData = getFilteredData();
    let visibleCount = filteredData.length;

    if (activeCategory) {
        visibleCount = filteredData.filter(loc => loc.tag === activeCategory).length;
    }

    document.getElementById('visible-points').textContent = visibleCount;
}

function searchCategories() {
    const searchTerm = document.getElementById('category-search').value.toLowerCase();
    const buttons = document.querySelectorAll('.filter-btn');

    buttons.forEach(button => {
        const categoryName = button.querySelector('span').textContent.toLowerCase();
        if (categoryName.includes(searchTerm)) {
            button.classList.remove('hidden');
        } else {
            button.classList.add('hidden');
        }
    });
}

function applyDateFilter() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    if (startDate && endDate) {
        dateFilter.start = startDate;
        dateFilter.end = endDate;

        refreshAllLayers();
        updateCategoryCounts();
        updateVisiblePoints();
        updateStatusIndicator();
        updateActiveFiltersCount();
    }
}

function refreshAllLayers() {
    if (map.hasLayer(heatmapLayer)) {
        map.removeLayer(heatmapLayer);
    }

    Object.values(heatmapLayers).forEach(layer => {
        if (map.hasLayer(layer)) {
            map.removeLayer(layer);
        }
    });

    // Follow filter
    if (markerGroup) {
        map.removeLayer(markerGroup);
    }
    createMarkerGroup();

    createHeatmapLayer();
    createCategoryLayers();

    if (activeCategory) {
        if (heatmapLayers[activeCategory]) {
            map.removeLayer(heatmapLayer);
            map.addLayer(heatmapLayers[activeCategory]);
        }
    } else {
        map.addLayer(heatmapLayer);
    }

    handleZoomChange();
}

function toggleFilter(category) {
    const button = document.querySelector(`[data-category="${category}"]`);

    if (activeCategory === category) {
        clearAllFilters();
        return;
    }

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    Object.values(heatmapLayers).forEach(layer => {
        if (map.hasLayer(layer)) {
            map.removeLayer(layer);
        }
    });

    if (map.hasLayer(heatmapLayer)) {
        map.removeLayer(heatmapLayer);
    }

    if (heatmapLayers[category]) {
        map.addLayer(heatmapLayers[category]);
        if (button) button.classList.add('active');
        activeCategory = category;
    }

    updateStatusIndicator();
    updateVisiblePoints();
    updateActiveFiltersCount();
    refreshAllLayers();
}

function clearAllFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    Object.values(heatmapLayers).forEach(layer => {
        if (map.hasLayer(layer)) {
            map.removeLayer(layer);
        }
    });

    if (!map.hasLayer(heatmapLayer)) {
        map.addLayer(heatmapLayer);
    }

    activeCategory = null;

    dateFilter.start = null;
    dateFilter.end = null;
    document.getElementById('start-date').value = '';
    document.getElementById('end-date').value = '';
    updateStatusIndicator();
    updateVisiblePoints();
    updateActiveFiltersCount();
    refreshAllLayers();
}

function updateStatusIndicator() {
    const statusIndicator = document.getElementById('status-indicator');

    if (activeCategory) {
        statusIndicator.textContent = `FILTERED: ${activeCategory.toUpperCase()}`;
        statusIndicator.classList.add('filtered');
        statusIndicator.classList.remove('no-filter');
    } else if (dateFilter.start && dateFilter.end) {
        statusIndicator.textContent = `DATE FILTERED: ${dateFilter.start} to ${dateFilter.end}`;
        statusIndicator.classList.add('filtered');
        statusIndicator.classList.remove('no-filter');
    } else {
        statusIndicator.textContent = 'NO FILTER ACTIVE';
        statusIndicator.classList.remove('filtered');
        statusIndicator.classList.add('no-filter');
    }
}

function updateActiveFiltersCount() {
    let count = 0;
    if (activeCategory) count++;
    if (dateFilter.start && dateFilter.end) count++;

    document.getElementById('active-filters').textContent = count;
}

function updateMapStyle() {
    map.eachLayer(function (layer) {
        if (layer._url) {
            map.removeLayer(layer);
        }
    });

    const style = mapStyles[currentMapStyle];
    L.tileLayer(style.url, {
        attribution: style.attribution,
        maxZoom: 19,
        tileSize: 256,
        zoomOffset: 0
    }).addTo(map);
}

function resetView() {
    map.setView([-2.5, 118.0], 5); // Center of Indonesia
}

function changeMapStyle() {
    currentMapStyle = (currentMapStyle + 1) % mapStyles.length;
    updateMapStyle();
}

window.addEventListener('resize', function () {
    if (map) {
        setTimeout(function () {
            map.invalidateSize();
        }, 100);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    initMap();
});

window.addEventListener('error', function (e) {
    console.error('Error loading script:', e);
    document.getElementById('loading').innerHTML = '<p style="color: red;">Error loading map resources</p>';
});