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
const observer = new MutationObserver((mutations) => {
  // Recheck whenever new nodes are added
  productCard();
});

// Observe the entire document (or a more specific container if possible)
observer.observe(document.body, {
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
  });

}

function getProductPrices() {
  const productItems = document.querySelectorAll('.atg-items-slider .grid__item');
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

// document.addEventListener("DOMContentLoaded", function () {
//   initSubscriptionToggle();
// });

// function initSubscriptionToggle() {
//   document.querySelectorAll('.sls-option').forEach((radio) => {
//     radio.addEventListener('change', function () {
//       // Remove 'sls-active' from all and apply to selected
//       document.querySelectorAll('.sls-option-container').forEach(container => {
//         container.classList.remove('sls-active');
//       });
  
//       const selectedContainer = this.closest('.sls-option-container');
//       selectedContainer.classList.add('sls-active');
  
//       // Always show original price — find it from the one-time purchase block
//       const originalContainer = document.querySelector('.sls-option-container input[value="one_time"]').closest('.sls-option-container');
//       const originalPrice = originalContainer.querySelector('.original-price')?.textContent.trim();
  
//       // Update the price block to always show original price
//       const priceRegular = document.querySelector('.price-item--regular');
//       const priceSale = document.querySelector('.price-item--sale');
//       if (priceRegular) priceRegular.textContent = originalPrice;
//       if (priceSale) priceSale.textContent = originalPrice;
  
//       // Only show discounted price if subscription is selected
//       const priceContainer = document.querySelector('.quick-add__submit .price__container');
//       let discountedDiv = priceContainer.querySelector('.new-discounted-price');
  
//       if (!discountedDiv) {
//         discountedDiv = document.createElement('div');
//         discountedDiv.className = 'new-discounted-price';
//         priceContainer.appendChild(discountedDiv);
//       }
  
//       if (this.value === 'subscription') {
//         const discounted = selectedContainer.querySelector('.discounted-price')?.textContent.trim();
//         discountedDiv.textContent = discounted;
//         discountedDiv.style.display = 'block';
//       } else {
//         discountedDiv.style.display = 'none';
//       }
//     });
//   });
// }

