const content = document.getElementById('content');
const toggle = document.getElementById('toggleFolders');
const placeholder = document.getElementById('placeholder');
const video = document.getElementById('player');
const logout = document.getElementById('logoutBtn');

logout.onclick = () =>
  fetch('/logout', { method: 'post' })
    .then(() => (location.href = '/arcturus/auth.html'));

let currentPath = [], fullData = null, playing = false;

toggle.onclick = () => {
  const hidden = content.classList.toggle('minimized');
  if (hidden) {
    toggle.innerText = '📂 Folders ';
  } else {
    toggle.innerText = '📂 Folders ';
  }
};

fetch('/api/index')
  .then(r => {
    if (r.status === 401) {
      location.href = '/arcturus/auth.html';
      throw 'Not Auth';
    }
    return r.json();
  })
  .then(d => { fullData = d; render(d); })
  .catch(console.error);

function render(data) {
  content.innerHTML = '';
  const list = currentPath.length ? traverse(data, currentPath) : data;
  updateBreadcrumb();

  if (currentPath.length) {
    const back = div('🔙 Back', () => {
      currentPath.pop();
      render(fullData);
    });
    content.append(back);
  }

  list.forEach(item => {
    const el = div(item.name, () => {
      if (item.type === 'folder') {
        currentPath.push(item.name);
        render(data);
      } else {
        play(item.path);
      }
    });
    content.append(el);
  });

  if (!playing) {
    content.classList.remove('minimized');
    toggle.style.display = 'none';
  }
}

function traverse(data, pathArr) {
  return pathArr.reduce((lvl, seg) => {
    const f = lvl.find(i => i.type === 'folder' && i.name === seg);
    return f ? f.children : [];
  }, data);
}

function updateBreadcrumb() {
  const bc = document.getElementById('breadcrumb');
  bc.innerHTML = '';

  const root = span('🏠', () => {
    currentPath = [];
    render(fullData);
  });
  root.title = '/';
  bc.append(root);

  currentPath.forEach((seg, i) => {
    bc.insertAdjacentText('beforeend', ' › ');
    const full = '/' + currentPath.slice(0, i + 1).join('/');
    const el = span(seg, () => {
      currentPath = currentPath.slice(0, i + 1);
      render(fullData);
    });
    el.title = full;
    el.addEventListener('mouseenter', () => (el.style.textDecoration = 'underline'));
    el.addEventListener('mouseleave', () => (el.style.textDecoration = 'none'));
    bc.append(el);
  });
}

function play(p) {
  const np = p.replace(/\\/g, '/');
  video.src = `/video?path=${encodeURIComponent(np)}`;
  placeholder.style.display = 'none';
  content.classList.add('minimized');

  toggle.innerText = '📂 Folders ';
  toggle.style.display = 'inline-block';

  video.classList.remove('show');
  video.style.display = 'block';
  setTimeout(() => video.classList.add('show'), 20);

  video.scrollIntoView({ behavior: 'smooth' });
  video.play();
  playing = true;
}

function div(text, fn) {
  const d = document.createElement('div');
  d.className = 'item';
  d.setAttribute('role', 'listitem');
  d.innerText = text;
  d.onclick = fn;
  return d;
}

function span(text, fn) {
  const s = document.createElement('span');
  s.innerText = text;
  s.setAttribute('role', 'listitem');
  s.style.cursor = 'pointer';
  s.onclick = fn;
  return s;
}
