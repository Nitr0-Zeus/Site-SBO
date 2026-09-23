/* =============================================================================
   SBO - Comércio de Peças e Equipamentos | JavaScript global
   =============================================================================
   Arquivo : assets/js/main.js
   Função  : Comportamentos compartilhados por todas as páginas do site:
             1) Header transparente → sólido no scroll (estilo PepsiCo);
             2) Menu mobile (abrir/fechar);
             3) Destaque do item de navegação ativo (página atual);
             4) Scroll suave para âncoras internas;
             5) Scroll-spy para links de navegação com âncora.

   PADRÕES DE NOMENCLATURA:
   - Seletor/atributo  | Elemento que controla
     .header--overlay  | Header sobreposto ao hero (transparente no topo).
     .header.is-scrolled | Header solidificado após rolagem.
     .header__toggle   | Botão hambúrguer do menu mobile.
     #mobileMenu       | Contêiner da gaveta lateral (menu mobile).
     [data-modal-trigger] | Links que abrem o modal de produto. Estes devem
                        |   ser ignorados pelo scroll suave (não são âncoras).
     a[href^="#"]      | Âncoras internas da própria página (scroll suave).

   OBSERVAÇÕES PARA A PRÓXIMA EQUIPE:
   - O script é autocontido (IIFE) e não expõe variáveis globais.
   - Não há dependências externas (JavaScript puro, sem bibliotecas).
   ============================================================================= */

(function () {
  'use strict';

  /* ==========================================================================
   * 1. HEADER TRANSPARENTE → SÓLIDO NO SCROLL
   * Páginas com hero usam .header--overlay (texto branco sobre a foto).
   * Ao rolar além do topo, adiciona .is-scrolled e o header vira branco.
   * ======================================================================== */
  var overlayHeader = document.querySelector('.header--overlay');

  if (overlayHeader) {
    var headerScrolled = false;

    function atualizarHeaderOverlay() {
      var shouldScroll = window.pageYOffset > 24;
      if (shouldScroll !== headerScrolled) {
        headerScrolled = shouldScroll;
        overlayHeader.classList.toggle('is-scrolled', shouldScroll);
      }
    }

    window.addEventListener('scroll', atualizarHeaderOverlay, { passive: true });
    atualizarHeaderOverlay();
  }

  /* ==========================================================================
   * 2. MENU MOBILE
   * Comportamento do botão hambúrguer e da gaveta lateral em telas menores.
   * ======================================================================== */
  var menuToggle = document.querySelector('.header__toggle');
  var mobileMenu = document.getElementById('mobileMenu');

  if (menuToggle && mobileMenu) {
    var menuOverlay = mobileMenu.querySelector('.mobile-menu__overlay');
    var menuLinks = mobileMenu.querySelectorAll('a');

    // Abre o menu: exibe a gaveta, trava o scroll da página e ajusta acessibilidade.
    function abrirMenu() {
      mobileMenu.classList.add('is-open');
      menuToggle.classList.add('is-active');
      menuToggle.setAttribute('aria-expanded', 'true');
      menuToggle.setAttribute('aria-label', 'Fechar menu');
      document.body.style.overflow = 'hidden';
    }

    // Fecha o menu: reverte todos os estados aplicados por abrirMenu().
    function fecharMenu() {
      mobileMenu.classList.remove('is-open');
      menuToggle.classList.remove('is-active');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menu');
      document.body.style.overflow = '';
    }

    // Alterna o estado do menu ao clicar no botão hambúrguer.
    menuToggle.addEventListener('click', function () {
      if (mobileMenu.classList.contains('is-open')) {
        fecharMenu();
      } else {
        abrirMenu();
      }
    });

    // Fecha o menu ao clicar na área escura (overlay) fora da gaveta.
    menuOverlay.addEventListener('click', fecharMenu);

    // Fecha o menu ao clicar em qualquer link dentro da gaveta.
    menuLinks.forEach(function (link) {
      link.addEventListener('click', fecharMenu);
    });

    // Fecha o menu com a tecla ESC (acessibilidade).
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        fecharMenu();
      }
    });
  }

  /* ==========================================================================
   * 2. DESTAQUE DO ITEM DE NAVEGAÇÃO ATIVO
   * Marca com aria-current="page" o link do menu correspondente à página aberta.
   * ======================================================================== */
  var currentPageFile = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();

  document.querySelectorAll('.header__nav-link, .mobile-menu__link').forEach(function (navLink) {
    var linkHref = navLink.getAttribute('href');
    if (!linkHref) return;
    // Ignora âncoras (#) e fragmentos; compara apenas o nome do arquivo de destino.
    var targetFile = linkHref.split('#')[0].split('/').pop().toLowerCase();
    if (targetFile === currentPageFile) {
      navLink.setAttribute('aria-current', 'page');
    }
  });

  /* ==========================================================================
   * 3. SCROLL SUAVE PARA ÂNCORAS INTERNAS
   * Links do tipo a[href^="#"] rolam suavemente até o elemento de destino,
   * compensando a altura fixa do cabeçalho para não esconder o conteúdo.
   * Links com [data-modal-trigger] são ignorados (abrem o modal de produto).
   * ======================================================================== */

  // Altura do cabeçalho, usada como compensação de rolagem.
  function obterOffsetDoHeader() {
    var headerElement = document.querySelector('.header');
    return headerElement ? headerElement.offsetHeight : 0;
  }

  // Rola suavemente até o elemento identificado por `targetId`.
  function rolarParaElemento(targetId) {
    var targetElement = document.getElementById(targetId);
    if (!targetElement) return;
    var scrollTop = targetElement.getBoundingClientRect().top + window.pageYOffset - obterOffsetDoHeader();
    window.scrollTo({ top: Math.max(scrollTop, 0), behavior: 'smooth' });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    // Links de produto abrem o modal — não devem disparar scroll suave.
    if (link.hasAttribute('data-modal-trigger')) return;

    link.addEventListener('click', function (e) {
      var hash = link.getAttribute('href');
      // "#" sozinho representa o topo da página.
      if (hash === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (hash.length < 2) return;
      var targetId = hash.slice(1);
      if (!document.getElementById(targetId)) return;
      e.preventDefault();
      rolarParaElemento(targetId);
      history.replaceState(null, '', hash);
    });
  });

  /* ==========================================================================
   * 4. SCROLL-SPY
   * Destaca no menu o link da seção atualmente em foco (aplica-se apenas a
   * links de navegação que apontam para âncoras internas da própria página).
   * ======================================================================== */
  var scrollSpyLinks = Array.prototype.filter.call(
    document.querySelectorAll('.header__nav-link, .mobile-menu__link'),
    function (link) {
      var hash = link.getAttribute('href');
      return hash && hash.charAt(0) === '#' && hash.length > 1 && document.getElementById(hash.slice(1));
    }
  );

  if (scrollSpyLinks.length) {
    // Mapeia cada link de âncora para a seção correspondente no DOM.
    var scrollSpySections = scrollSpyLinks.map(function (link) {
      return document.getElementById(link.getAttribute('href').slice(1));
    });

    // Atualiza o link ativo conforme a posição de rolagem da página.
    function atualizarScrollSpy() {
      var scrollPosition = window.pageYOffset + obterOffsetDoHeader() + 80;
      var activeLink = null;

      scrollSpySections.forEach(function (sectionElement, i) {
        if (sectionElement.offsetTop <= scrollPosition) activeLink = scrollSpyLinks[i];
      });

      scrollSpyLinks.forEach(function (link) {
        link.classList.toggle('is-active', link === activeLink);
      });
    }

    window.addEventListener('scroll', atualizarScrollSpy, { passive: true });
    atualizarScrollSpy();
  }
  /* ==========================================================================
   * 5. ANIMAÇÕES DE SCROLL (SCROLL-REVEAL)
   * Detecta elementos com [data-reveal] e adiciona .is-visible quando entram
   * no viewport. Funciona como fallback para browsers sem suporte a
   * CSS Scroll-Driven Animations (animation-timeline: view()).
   * ======================================================================== */
  var scrollRevealElements = document.querySelectorAll('[data-reveal]');

  if (scrollRevealElements.length && 'IntersectionObserver' in window) {
    // Verifica se o navegador suporta CSS Scroll-Driven Animations.
    // Se suportar, o CSS já cuida da animação — o JS apenas marca como visível
    // para caso o usuário tenha prefers-reduced-motion desativado.
    var supportsScrollTimeline = CSS && CSS.supports && CSS.supports('animation-timeline', 'view()');

    if (!supportsScrollTimeline) {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      });

      scrollRevealElements.forEach(function (el) {
        revealObserver.observe(el);
      });
    } else {
      // Navegador suporta scroll-driven: apenas garante visibilidade
      // para quem tem prefers-reduced-motion (conteúdo aparece sem animação).
      scrollRevealElements.forEach(function (el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }
  } else if (scrollRevealElements.length) {
    // Fallback final: browsers muito antigos sem IntersectionObserver
    scrollRevealElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ==========================================================================
   * 6. ANO DINÂMICO NO RODAPÉ
   * Substitui o ano fixo do copyright pelo ano atual, evitando que a data
   * fique desatualizada. Mantém o restante do texto original.
   * ======================================================================== */
  document.querySelectorAll('.footer__copyright').forEach(function (el) {
    el.textContent = '© ' + new Date().getFullYear() + ' SBO. Todos os direitos reservados.';
  });
})();