$(function () {
  console.log('Hello world!3');
  toggleButtons();
  infiniteMarquee();
  // productCard();
    initCustomSectionSlider();
});


function toggleButtons() {
  const toggleSwitch = document.getElementById("toggleSwitch");
  const bodyElement = document.body;

  if (toggleSwitch) {
    toggleSwitch.addEventListener("change", function () {
      if (this.checked) {
        bodyElement.classList.add("night");
      } else {
        bodyElement.classList.remove("night");
      }
    });
  }
}

function infiniteMarquee() {
  const marqueeContent = document.querySelector(".marquee-content");

  if (marqueeContent) {
    const parentWidth = marqueeContent.parentElement.offsetWidth;
    let contentWidth = marqueeContent.scrollWidth;

    // Duplicate content until it fills at least twice the parent width
    while (contentWidth < parentWidth * 2) {
      const clonedContent = marqueeContent.cloneNode(true);
      marqueeContent.parentElement.appendChild(clonedContent);
      contentWidth += clonedContent.scrollWidth;
    }
  }
}

function productCard() {
  // Select all product cards (or a more specific container if possible)
  const productCards = document.querySelectorAll('.grid__item .card-wrapper'); 
  
  productCards.forEach(card => {
    const descriptionElement = card.querySelector(".sls-description.seal-row");
    const quickAddSubmitElement = card.querySelector(".quick-add__submit");
    
    // If both elements exist and are not already in the correct order
    if (descriptionElement && quickAddSubmitElement && 
        descriptionElement.previousElementSibling !== quickAddSubmitElement) {
      quickAddSubmitElement.insertAdjacentElement("afterend", descriptionElement);
    }
  });
}

// Initial run in case elements are already loaded
productCard();

// Set up MutationObserver to handle dynamically loaded content
const productCardObserver = new MutationObserver((mutations) => {
  // Recheck whenever new nodes are added
  productCard();
});

// Observe the entire document (or a more specific container if possible)
productCardObserver.observe(document.body, {
  childList: true,
  subtree: true,
});


initCustomSectionSlider = () =>{
  $(".atg-items-slider").flickity({
    cellAlign: 'left',
    contain: true,
    fade: false,
    wrapAround: true,
    pageDots: false,
    adaptiveHeight: false,
    draggable: false,
    resize: true,
    prevNextButtons: true,
    arrowShape: "M36.7,76.9c1.9,1.4,1.9,3.8,0,5.7c-0.6,0.6-1.6,0.9-2.8,0.9c-0.9,0-1.9-0.3-2.8-0.9L2.2,52.8 c-1.9-1.4-1.9-4.3,0-5.7L30,18.3c1.4-1.4,3.8-1.4,5.2,0c1.9,1.4,1.9,4.3,0,5.7L10.2,50L36.7,76.9z M95.2,46.2c1.9,0,3.8,1.9,3.8,4.3 c0,2.4-1.9,3.8-3.8,3.8H13c-2.4,0-3.8-1.4-3.8-3.8c0-2.4,1.4-4.3,3.8-4.3H95.2z"
  });

}

function getProductPrices() {
  const productItems = document.querySelectorAll('.grid__item');
  const priceData = [];

  productItems.forEach((product, index) => {
    const priceElement = product.querySelector('.price[data-product-price]');
    let originalPrice = null;
    let rawPrice = null;
    let discountedPrice = null;

    if (priceElement) {
      rawPrice = priceElement.getAttribute('data-product-price');

      const cleanPrice = rawPrice
        .replace(/[^\d.-]/g, '')
        .replace(/^[^0-9]+/, '');

      originalPrice = parseFloat(cleanPrice);

      if (!isNaN(originalPrice)) {
        discountedPrice = originalPrice * (1 - 10 / 100);
        priceData.push({
          productIndex: index,
          originalPrice: originalPrice,
          discountedPrice: parseFloat(discountedPrice.toFixed(2)),
          rawValue: rawPrice
        });
      } else {
        console.warn(`Could not parse price for product ${index + 1}:`, rawPrice);
      }
    }

    function injectPriceLabel(container, originalPrice, discountedPrice, rawPrice, index) {
      if (!container || originalPrice === null || discountedPrice === null) return;
    
      const currency = (typeof rawPrice === 'string') ? rawPrice.replace(/[\d.,\s]/g, '') : '';

      const isOneTime = container.previousElementSibling?.querySelector('input[type="radio"]')?.value === 'one_time'
        || container.closest('.sls-option-container')?.querySelector('input[type="radio"]')?.value === 'one_time';
    
      // Inject original price if not already present
      if (isOneTime){
        if (!container.querySelector('.original-price')) {
          const originalDiv = document.createElement('div');
          originalDiv.className = 'original-price';
          originalDiv.textContent = `${currency} ${originalPrice.toFixed(2)}`;
          container.appendChild(originalDiv);
        }
      }
    
      // Determine if this container is the "Subscribe & Save" label
      const isSubscription = container.previousElementSibling?.querySelector('input[type="radio"]')?.value === 'subscription'
        || container.closest('.sls-option-container')?.querySelector('input[type="radio"]')?.value === 'subscription';
    
      if (isSubscription) {
        if (!container.querySelector('.discounted-price')) {
          const discountedDiv = document.createElement('div');
          discountedDiv.className = 'discounted-price';
          discountedDiv.textContent = `${currency} ${discountedPrice.toFixed(2)}`;
          container.appendChild(discountedDiv);
          // console.log(`Injected discounted price into label container for product ${index + 1}:`, discountedDiv.outerHTML);
        }
      }
    }
    
    // Observe for .sls-label-container inside this product
    const observer = new MutationObserver((mutationsList, observerInstance) => {
      mutationsList.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (
            node.nodeType === 1 && // ELEMENT_NODE
            node.matches('.sls-label-container')
          ) {
            injectPriceLabel(node, originalPrice, discountedPrice, rawPrice, index);
          } else if (
            node.nodeType === 1 &&
            node.querySelector('.sls-label-container')
          ) {
            const label = node.querySelector('.sls-label-container');
            injectPriceLabel(label, originalPrice, discountedPrice, rawPrice, index);
          }
          const existingLabelContainers = product.querySelectorAll('.sls-label-container');
          existingLabelContainers.forEach(container => {
            injectPriceLabel(container, originalPrice, discountedPrice, rawPrice, index);
          });
          
        });
      });
    });
    

    observer.observe(product, {
      childList: true,
      subtree: true 
    });
  });

  return priceData;
}

// Kick off processing
document.addEventListener('DOMContentLoaded', () => {
  const productPrices = getProductPrices();

  if (productPrices.length === 0) {
    console.error("No valid prices found. Check your selectors and data attributes.");
  } 
  // else {
  //   console.log("Original and discounted prices:");
  //   productPrices.forEach(item => {
  //     console.log(
  //       `Product ${item.productIndex + 1}: ` +
  //       `Original: ${item.originalPrice.toFixed(2)} ` +
  //       `(raw: "${item.rawValue}"), ` +
  //       `Discounted: ${item.discountedPrice.toFixed(2)}`
  //     );
  //   });
  // }
 
});

function setupProductCardHover() {
  // Hide all .atg-pc-bottom elements initially
  document.querySelectorAll('.atg-pc-bottom').forEach(bottom => {
    bottom.style.display = 'none';
  });

  // Add hover event listeners to each .atg-pc-top
  document.querySelectorAll('.atg-pc-top').forEach(top => {
    const card = top.closest('.card-wrapper .card');
    if (!card) return;
    const bottom = card.querySelector('.atg-pc-bottom');
    if (!bottom) return;

    top.addEventListener('mouseenter', () => {
      top.style.display = 'none';
      bottom.style.display = '';
    });

    // When mouse leaves .atg-pc-bottom, revert to original state
    card.addEventListener('mouseleave', () => {
      bottom.style.display = 'none';
      top.style.display = '';
    });
  });
}

// Run after DOM is loaded
document.addEventListener('DOMContentLoaded', setupProductCardHover);

