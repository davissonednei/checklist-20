/* ========================================
   SERVICE WORKER - FUNCIONALIDADE OFFLINE
   ======================================== */

const CACHE_NAME = 'checklist-viaturas-v72';
const urlsToCache = [
    '/',
    '/index.html',
    '/verificar.html',
    '/css/style.css',
    '/js/app.js',
    '/js/data.js',
    '/js/supabase-config.js',
    '/manifest.json',
    '/img/icon.svg',
    '/img/icon-192.png',
    '/img/icon-512.png',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'
];

// Instalar Service Worker e cachear arquivos
self.addEventListener('install', (event) => {
    // Força ativação imediata
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Cache aberto');
                return cache.addAll(urlsToCache);
            })
    );
});

// Buscar da REDE primeiro, depois do cache (network-first)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Se a rede funcionar, atualiza o cache e retorna
                if (response && response.status === 200) {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                }
                return response;
            })
            .catch(() => {
                // Se falhar (offline), busca do cache
                return caches.match(event.request);
            })
    );
});

// Atualizar cache quando houver nova versão
self.addEventListener('activate', (event) => {
    // Força controle imediato de todas as páginas
    event.waitUntil(
        Promise.all([
            clients.claim(),
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('Removendo cache antigo:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        ])
    );
});
