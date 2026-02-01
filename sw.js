/* ========================================
   SERVICE WORKER - FUNCIONALIDADE OFFLINE
   ======================================== */

const CACHE_NAME = 'checklist-viaturas-v8';
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
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Cache aberto');
                return cache.addAll(urlsToCache);
            })
    );
});

// Buscar do cache ou da rede
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Retorna do cache se existir
                if (response) {
                    return response;
                }

                // Senão, busca na rede
                return fetch(event.request).then((response) => {
                    // Verifica se é uma resposta válida
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clona a resposta para o cache
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                });
            })
    );
});

// Atualizar cache quando houver nova versão
self.addEventListener('activate', (event) => {
    event.waitUntil(
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
    );
});
