const cachedFiles = [
    './',
    './index.js',
    './index.html',
    './index.css',
    './manifest.json',
    './public/stylesheets/jquery-3.4.1.min.js',
    './public/images/about_us/part5/part5-logo.svg',
    './public/images/icons/Android/Icon-144.png',
    './public/images/icons/iOS/apple-touch-icon-144x144.png',
    './public/images/about_us/part1/location-icon-small.svg',
    './public/images/about_us/part1/find.svg',
    './public/images/00/00-12.svg',
    './public/images/00/00-04.svg',
    './public/images/00/00-08.svg',
    './public/images/00/00-07.svg',
    './public/images/a1/a1-04.svg',
    './public/images/a1/a1-02.svg',
    './public/images/a1/a1-09.svg',
    './public/images/a1/a1-10.svg',
    './public/images/a1/a1-14定位.svg',
    './public/images/a1/a1-15.svg',
    './public/images/a1/a1-24前.svg',
    './public/images/a1/a1-25前.svg',
    'https://code.jquery.com/jquery-3.4.1.slim.min.js',
    'https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js',
]

const cacheKey = 'sw-v1'

// install, a good time to preload cache
self.addEventListener('install', event => {
    console.log(`${cacheKey} is installed`)
    event.waitUntil((async () => {
        const cache = await caches.open(cacheKey)
        return cache.addAll(cachedFiles)
    })())
})

self.addEventListener('activate', event => {
    console.log(`${cacheKey} is activated`)
    event.waitUntil((async () => {
        const keys = await caches.keys()
        return Promise.all(keys.filter(key => key != cacheKey).map(key => caches.delete(key)))
    })())
})

self.addEventListener('fetch', event => {
    event.respondWith((async () => {
        const response = await caches.match(event.request)
        if (response) {
            console.log(`Cache fetch: ${event.request.url}`)
            return response
        }
        console.log(`Network fetch: ${event.request.url}`)
        return fetch(event.request)
    })())
})