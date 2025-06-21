import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-nosotros',
  templateUrl: './nosotros.component.html',
  styleUrls: ['./nosotros.component.css']
})
export class NosotrosComponent implements AfterViewInit {
  titulo = '¿Quiénes somos?';
  parrafo = `En GROM FITNESS CENTER somos un gimnasio local de Aguascalientes, creado con el propósito de ofrecer una experiencia única en el mundo del fitness. 
Nos dedicamos a proporcionar un ambiente motivador y de alto rendimiento, donde el bienestar y el esfuerzo de cada persona son nuestra prioridad.
Queremos que cada miembro se sienta motivado y satisfecho con su progreso, porque sabemos que la clave para alcanzar tus metas es la constancia y el apoyo adecuado.
En GROM FITNESS CENTER, trabajamos cada día para que tu experiencia sea inolvidable y que te sientas parte de una comunidad dedicada a mejorar la salud y el rendimiento físico.`;

  ngAfterViewInit(): void {
    const btnPlay = document.getElementById('btn-lector-nosotros') as HTMLElement;
    const btnPause = document.getElementById('btn-pausa-nosotros') as HTMLElement;
    const btnStop = document.getElementById('btn-detener-nosotros') as HTMLElement;

    const contenedor = document.getElementById('contenido-lector-nosotros');
    if (!contenedor) return;

    const titulo = contenedor.querySelector('h3') as HTMLElement;
    const parrafos = contenedor.querySelectorAll('p, li') as NodeListOf<HTMLElement>;

    let texto = '';
    if (titulo) texto += titulo.innerText + ' ';
    parrafos.forEach(p => texto += p.innerText + ' ');
    const palabras = texto.trim().split(/\s+/);

    if (titulo) {
      const palabrasTitulo = titulo.innerText.trim().split(/\s+/);
      titulo.innerHTML = palabrasTitulo.map(w => `<span>${w}</span>`).join(' ');
    }

    parrafos.forEach(p => {
      const palabrasParrafo = p.innerText.trim().split(/\s+/);
      p.innerHTML = palabrasParrafo.map(w => `<span>${w}</span>`).join(' ');
    });

    const spans = contenedor.querySelectorAll('span');
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'es-ES';

    const setVoice = () => {
      const voces = speechSynthesis.getVoices();
      const vozMasculina = voces.find(v =>
        v.lang.startsWith('es') &&
        (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('hombre'))
      );
      utterance.voice = vozMasculina || voces.find(v => v.lang.startsWith('es')) || null;
    };

    let isPaused = false;

    utterance.onboundary = function (event) {
      if (event.charIndex !== undefined) {
        const charIndex = event.charIndex;
        let index = 0, count = 0;
        for (let i = 0; i < palabras.length; i++) {
          count += palabras[i].length + 1;
          if (count > charIndex) {
            index = i;
            break;
          }
        }
        spans.forEach(span => span.classList.remove('highlight'));
        if (spans[index]) spans[index].classList.add('highlight');
      }
    };

    utterance.onend = function () {
      spans.forEach(span => span.classList.remove('highlight'));
      btnPlay.style.display = 'inline-block';
      btnPause.style.display = 'none';
      btnStop.style.display = 'none';
    };

    if (!document.getElementById('lector-style')) {
      const style = document.createElement('style');
      style.id = 'lector-style';
      style.innerHTML = `.highlight { background-color: yellow; }`;
      document.head.appendChild(style);
    }

    btnPlay.addEventListener('click', () => {
      if (isPaused) {
        speechSynthesis.resume();
        isPaused = false;
        btnPlay.style.display = 'none';
        btnPause.style.display = 'inline-block';
      } else {
        setVoice();
        speechSynthesis.cancel();
        speechSynthesis.speak(utterance);
        btnPlay.style.display = 'none';
        btnPause.style.display = 'inline-block';
        btnStop.style.display = 'inline-block';
      }
    });

    btnPause.addEventListener('click', () => {
      speechSynthesis.pause();
      isPaused = true;
      btnPlay.style.display = 'inline-block';
      btnPause.style.display = 'none';
    });

    btnStop.addEventListener('click', () => {
      speechSynthesis.cancel();
      spans.forEach(span => span.classList.remove('highlight'));
      btnPlay.style.display = 'inline-block';
      btnPause.style.display = 'none';
      btnStop.style.display = 'none';
      isPaused = false;
    });

    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.onvoiceschanged = setVoice;
    } else {
      setVoice();
    }

    const parrafo = document.getElementById('parrafo-nosotros') as HTMLElement;
    const aumentarBtn = document.getElementById('aumentar-texto-nosotros');
    const reducirBtn = document.getElementById('reducir-texto-nosotros');

    let tamañoActual = 18;

    aumentarBtn?.addEventListener('click', () => {
      tamañoActual += 2;
      parrafo.style.fontSize = `${tamañoActual}px`;
    });

    reducirBtn?.addEventListener('click', () => {
      tamañoActual = Math.max(12, tamañoActual - 2);
      parrafo.style.fontSize = `${tamañoActual}px`;
    });
  }
}
