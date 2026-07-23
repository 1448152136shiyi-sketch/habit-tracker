const CACHE = 'ht-v2';
const FILES = ['index.html', 'manifest.json'];

// 每次都先联网，连不上才用缓存
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // 拿到新版就更新缓存
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request)) // 离线用缓存
  );
});

// 激活时清旧缓存
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
});
