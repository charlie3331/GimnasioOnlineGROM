import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})
export class ServiciosComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    const btnPlay = document.getElementById('btn-lector-servicios') as HTMLElement;
    const btnPause = document.getElementById('btn-pausa-servicios') as HTMLElement;
    const btnStop = document.getElementById('btn-detener-servicios') as HTMLElement;

    const contenedor = document.getElementById('contenido-lector-servicios');
    if (!contenedor) return;

    const parrafos = contenedor.querySelectorAll('h3, h4, p, li') as NodeListOf<HTMLElement>;
    let texto = '';
    parrafos.forEach(p => texto += p.innerText + ' ');
    const palabras = texto.trim().split(/\s+/);

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

    utterance.onboundary = function (event: SpeechSynthesisEvent) {
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
  }
}
