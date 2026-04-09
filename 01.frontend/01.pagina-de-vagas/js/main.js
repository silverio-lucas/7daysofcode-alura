document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".numero");

  const parseValue = (text) => {
    text = text.trim().toUpperCase();

    let suffix = "";
    let number = text;

    if (text.includes("K")) {
      suffix = "K";
      number = parseFloat(text.replace("K", "")) * 1000;
    } else if (text.includes("+")) {
      suffix = "+";
      number = parseFloat(text.replace("+", ""));
    } else {
      number = parseFloat(text.replace(/\./g, ""));
    }

    return { number, suffix };
  };

  const animate = (el, delay = 0) => {
    const { number: target, suffix } = parseValue(el.textContent);

    if (isNaN(target)) {
      console.error("Valor inválido:", el.textContent);
      return;
    }

    const duration = 1200;

    setTimeout(() => {
      const startTime = performance.now();

      const update = (currentTime) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        let value = Math.floor(eased * target);

        // formatação
        let formatted = new Intl.NumberFormat("pt-BR").format(value);

        // reanexa sufixo
        if (suffix === "K") {
          formatted = Math.floor(value / 1000) + "K";
        } else if (suffix === "+") {
          formatted += "+";
        }

        el.textContent = formatted;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          // garante valor final correto
          if (suffix === "K") {
            el.textContent = target / 1000 + "K";
          } else if (suffix === "+") {
            el.textContent = target + "+";
          } else {
            el.textContent = new Intl.NumberFormat("pt-BR").format(target);
          }
        }
      };

      requestAnimationFrame(update);
    }, delay);
  };

  // efeito cascata (melhor UX)
  counters.forEach((el, i) => {
    animate(el, i * 200);
  });
});
