/**
 * INFOSTORE - SISTEMA DE GESTÃO
 * Arquivo JavaScript Externo (script.js)
 */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. GERENCIAMENTO DE TELAS (LOGIN <-> SISTEMA)
  // ============================================================
  const loginScreen = document.getElementById('login-screen');
  const appScreen = document.getElementById('app-screen');
  const loginForm = document.getElementById('login-form');
  const usernameInput = document.getElementById('username-input');
  const passwordInput = document.getElementById('password-input');
  const btnLogin = document.getElementById('btn-login');
  const forgotPasswordBtn = document.getElementById('forgot-password-link');
  const logoutBtn = document.getElementById('logout-btn');
  const themeToggle = document.getElementById('theme-toggle');

  // Alternar para tela principal (Dashboard)
  function showApp() {
    loginScreen.classList.remove('active');
    appScreen.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Alternar para tela de Login
  function showLogin() {
    appScreen.classList.remove('active');
    loginScreen.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Envio do formulário de login
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const user = usernameInput.value.trim();
      const pass = passwordInput.value.trim();

      if (!user) {
        showToast('Por favor, informe seu usuário.');
        usernameInput.focus();
        return;
      }

      if (!pass) {
        showToast('Por favor, digite sua senha.');
        passwordInput.focus();
        return;
      }

      // Efeito de carregamento no botão
      const originalText = btnLogin.innerHTML;
      btnLogin.innerHTML = '<span>Entrando...</span>';
      btnLogin.style.opacity = '0.8';

      setTimeout(() => {
        btnLogin.innerHTML = originalText;
        btnLogin.style.opacity = '1';
        showToast(`Bem-vindo ao InfoStore, ${user}!`);
        showApp();
      }, 500);
    });
  }

  // Botão Sair da Sidebar
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      showToast('Sessão encerrada com sucesso.');
      showLogin();
      closeSidebar();
    });
  }

  // Botão de alternância rápida no topo (atalho para testes)
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      showLogin();
      showToast('Retornou à tela de login');
    });
  }

  // Esqueceu sua senha?
  if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener('click', () => {
      showToast('Um link de recuperação foi enviado para o seu e-mail cadastrado.');
    });
  }


  // ============================================================
  // 2. MOSTRAR / OCULTAR SENHA (EYE TOGGLE)
  // ============================================================
  const togglePasswordBtn = document.getElementById('toggle-password-btn');
  const eyeIcon = document.getElementById('eye-icon');
  const eyeOffIcon = document.getElementById('eye-off-icon');

  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';

      if (isPassword) {
        eyeIcon.classList.add('hidden');
        eyeOffIcon.classList.remove('hidden');
      } else {
        eyeIcon.classList.remove('hidden');
        eyeOffIcon.classList.add('hidden');
      }
    });
  }


  // ============================================================
  // 3. MENU LATERAL / SIDEBAR RESPONSIVO
  // ============================================================
  const appSidebar = document.getElementById('app-sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const closeSidebarBtn = document.getElementById('close-sidebar-btn');

  function openSidebar() {
    appSidebar.classList.add('open');
    sidebarBackdrop.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    appSidebar.classList.remove('open');
    sidebarBackdrop.classList.remove('show');
    document.body.style.overflow = '';
  }

  if (menuToggleBtn) {
    menuToggleBtn.addEventListener('click', openSidebar);
  }

  if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener('click', closeSidebar);
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeSidebar);
  }

  // Fechar menu com a tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && appSidebar.classList.contains('open')) {
      closeSidebar();
    }
  });


  // ============================================================
  // 4. NAVEGAÇÃO ENTRE ABAS DO SISTEMA
  // ============================================================
  const navItems = document.querySelectorAll('.nav-item[data-target]');
  const contentSections = document.querySelectorAll('.content-section');
  const currentPageTitle = document.getElementById('current-page-title');

  window.appNavigation = {
    switchTab: (targetId) => {
      // Atualizar classe ativa nos botões da barra lateral
      navItems.forEach(item => {
        if (item.getAttribute('data-target') === targetId) {
          item.classList.add('active');
          const titleText = item.querySelector('span')?.innerText;
          if (titleText && currentPageTitle) {
            currentPageTitle.innerText = titleText;
          }
        } else {
          item.classList.remove('active');
        }
      });

      // Atualizar seção exibida
      contentSections.forEach(section => {
        if (section.id === targetId) {
          section.classList.add('active');
        } else {
          section.classList.remove('active');
        }
      });

      // Fechar sidebar em dispositivos móveis
      if (window.innerWidth <= 768) {
        closeSidebar();
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  navItems.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      if (target) {
        window.appNavigation.switchTab(target);
      }
    });
  });


  // ============================================================
  // 5. GRÁFICO INTERATIVO DE VENDAS (SVG)
  // ============================================================
  const chartPointsGroup = document.getElementById('chart-points');
  const chartTooltip = document.getElementById('chart-tooltip');
  const chartContainer = document.getElementById('sales-chart-container');

  // Dados dos 12 meses
  const salesData = [
    { month: 'Janeiro', revenue: 'R$ 3.420', x: 20, y: 150 },
    { month: 'Fevereiro', revenue: 'R$ 4.100', x: 70, y: 128 },
    { month: 'Março', revenue: 'R$ 3.850', x: 120, y: 142 },
    { month: 'Abril', revenue: 'R$ 4.600', x: 170, y: 118 },
    { month: 'Maio', revenue: 'R$ 4.050', x: 220, y: 135 },
    { month: 'Junho', revenue: 'R$ 5.120', x: 270, y: 110 },
    { month: 'Julho', revenue: 'R$ 4.400', x: 320, y: 126 },
    { month: 'Agosto', revenue: 'R$ 6.350', x: 370, y: 88 },
    { month: 'Setembro', revenue: 'R$ 5.700', x: 420, y: 102 },
    { month: 'Outubro', revenue: 'R$ 7.150', x: 470, y: 74 },
    { month: 'Novembro', revenue: 'R$ 6.400', x: 520, y: 90 },
    { month: 'Dezembro', revenue: 'R$ 8.400', x: 570, y: 55 }
  ];

  if (chartPointsGroup && chartTooltip && chartContainer) {
    // Inserir círculos interativos no SVG
    salesData.forEach((point) => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', point.x);
      circle.setAttribute('cy', point.y);
      circle.setAttribute('r', '4.5');

      // Eventos de Hover
      circle.addEventListener('mouseenter', () => {
        chartTooltip.innerHTML = `<strong>${point.month}:</strong> ${point.revenue}`;
        chartTooltip.style.opacity = '1';

        // Calcular posição proporcional no container
        const containerRect = chartContainer.getBoundingClientRect();
        const posX = (point.x / 600) * containerRect.width;
        const posY = (point.y / 180) * containerRect.height;

        chartTooltip.style.left = `${posX}px`;
        chartTooltip.style.top = `${posY}px`;
      });

      circle.addEventListener('mouseleave', () => {
        chartTooltip.style.opacity = '0';
      });

      chartPointsGroup.appendChild(circle);
    });
  }


  // ============================================================
  // 6. FILTRO DE BUSCA EM TABELAS
  // ============================================================
  function setupTableFilter(inputId, tableId) {
    const input = document.getElementById(inputId);
    const table = document.getElementById(tableId);

    if (!input || !table) return;

    input.addEventListener('input', () => {
      const filterText = input.value.toLowerCase().trim();
      const rows = table.querySelectorAll('tbody tr');

      rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(filterText) ? '' : 'none';
      });
    });
  }

  setupTableFilter('filter-clientes', 'clientes-table');
  setupTableFilter('filter-produtos', 'produtos-table');
  setupTableFilter('filter-fornecedores', 'fornecedores-table');
  setupTableFilter('filter-vendas', 'vendas-table');


  // ============================================================
  // 7. MODAL DE CADASTRO
  // ============================================================
  const modal = document.getElementById('app-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalInputName = document.getElementById('modal-input-name');
  const modalInputDetail = document.getElementById('modal-input-detail');

  window.appModal = {
    open: (type) => {
      const titles = {
        cliente: 'Cadastrar Novo Cliente',
        produto: 'Cadastrar Novo Produto',
        fornecedor: 'Cadastrar Novo Fornecedor',
        venda: 'Registrar Nova Venda'
      };

      if (modalTitle) {
        modalTitle.innerText = titles[type] || 'Novo Registro';
      }

      if (modalInputName) modalInputName.value = '';
      if (modalInputDetail) modalInputDetail.value = '';

      modal.classList.add('show');
      if (modalInputName) modalInputName.focus();
    },

    close: () => {
      modal.classList.remove('show');
    },

    save: () => {
      const name = modalInputName ? modalInputName.value.trim() : '';
      if (!name) {
        showToast('Por favor, informe a identificação/nome.');
        return;
      }

      showToast(`Item "${name}" salvo com sucesso!`);
      window.appModal.close();
    }
  };

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', window.appModal.close);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        window.appModal.close();
      }
    });
  }


  // ============================================================
  // 8. SISTEMA DE TOAST / NOTIFICAÇÃO FLUTUANTE
  // ============================================================
  let toastTimeout;
  window.showToast = function(message, duration = 3000) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    if (!toast || !toastMessage) return;

    toastMessage.innerText = message;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  };

});
