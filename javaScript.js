 const selectedColor = {
            name: '',
            value: '',
            quantity: 0,
            change: 0,
        };

        const colorPickerTitle = document.querySelector('.color-picker-title > span');

        const modal = new bootstrap.Modal(document.getElementById('quantity-control-modal'), {backdrop: 'static'});

        const quantityControlHidden = document.getElementById("quantity-control-hidden-value");
        const quantityControlValueDisplay = document.getElementById("quantity-control-value-display");
        const quantityControlItemNameDisplay = document.getElementById("quantity-control-item-name-display");
        const cancelQuantityButton = document.getElementById("cancel-quantity-button");
        const purchasedItems = document.querySelector('.purchased-items');

        const checkoutQuantity = document.getElementById("checkout-quantity-value");

        const quantityControlMinusButton = document.getElementById("quantity-control-minus-button");
        const quantityControlPlusButton = document.getElementById("quantity-control-plus-button");
        const checkoutButton = document.getElementById("checkout-button");
        const confirmQuantityButton = document.getElementById('confirm-quantity-button');


        /* HELP functions */

        // Deselects the currently selected color item
        const deselectAllSelectedColors = function () {
            document.querySelectorAll(".color-item.active").forEach(function (item) {
                item.classList.remove("active");
            });
        };

        // Clears the selected color object to it default state
        const clearSelectedColorObj = function(){
            Object.assign(selectedColor, {
                name: '',
                value: '',
                quantity: 0,
                change: 0,
            });            
        };

        // updates the color picker title which responsible for showing the current selected color name
        const updateColorPickerTitle = function(value = ''){
            colorPickerTitle.innerHTML = value;
        };

        // Selecting and looping through all color items
        document.querySelectorAll(".color-item").forEach(function (item) {

            /* Set background color for each color item to the corresponding data-color-value attribute */
            item.style.backgroundColor = item.getAttribute("data-color-value");

            item.addEventListener("click", function (evt) {
                if (evt.target.classList.contains("active")) {
                    clearSelectedColorObj(); // reset selected color obj
                    checkoutQuantity.value = selectedColor.quantity; // update checkout quantity to zero
                    checkoutButton.disabled  = true; // disable checkout button
                    updateColorPickerTitle(); // clear color picker title

                    evt.target.classList.remove("active"); // deselected the currently selected color
                } else {
                    deselectAllSelectedColors(); // deselected previously selected color

                    evt.target.classList.add("active"); // select currently selected color

                    let colorName = evt.target.getAttribute("data-color-name"); // get color name
                    let colorValue = evt.target.getAttribute("data-color-value"); // get color value


                    // update selected color object
                    Object.assign(selectedColor, {
                        name: colorName,
                        value: colorValue,
                        quantity: 0,
                        change: 0,
                    });

                    
                    checkoutButton.disabled  = false; // enable checkout button because there is a selected color
                    checkoutQuantity.value = selectedColor.quantity; // update checkout quantity to zero

                    // Change color picker title
                    updateColorPickerTitle(selectedColor.name);

                    // Config modal
                    configModal();
                }

                removeAllPurchasedItems();
                checkoutButton.value = "Add to Cart"; // ensure that checkout button says "Add to Cart"
            }, false);
        });

        quantityControlMinusButton.addEventListener("click", function(evt){
            if (selectedColor.quantity + selectedColor.change == 0) return; // if change will lead to a negative value, stop

            Object.assign(selectedColor, {
                change: selectedColor.change - 1, // record change
            });

            updateModal(); // update modal with recent changes
        }, false);

        quantityControlPlusButton.addEventListener("click", function(evt){
            Object.assign(selectedColor, {
                change: selectedColor.change + 1, // record change
            });

            updateModal(); // update modal with recent changes
        }, false);

        // updates modal with selected color object values
        const updateModal = function(){
            quantityControlHidden.value = selectedColor.quantity + selectedColor.change;
            quantityControlValueDisplay.innerHTML = selectedColor.quantity + selectedColor.change;
        };

        // used to config modal after a new color is selected
        const configModal = function(){
            updateModal();
            quantityControlItemNameDisplay.innerHTML = selectedColor.name; // update item name on the modal
        };

        confirmQuantityButton.addEventListener("click", function(){
            Object.assign(selectedColor, {
                quantity: selectedColor.quantity + selectedColor.change,
                change: 0,
            });

            checkoutQuantity.value = selectedColor.quantity;
            createPurchasedItems(selectedColor.quantity)
            modal.hide();
        }, false);

        const removeAllPurchasedItems = function(){
            while(purchasedItems.firstChild){
                purchasedItems.removeChild(purchasedItems.firstChild);
            }
        };

        const createPurchasedItems = function(n){
            if(parseInt(n, 10) > 0){
                checkoutButton.value = "Checkout Now";
            }

            removeAllPurchasedItems();

            for(let i = 0; i < parseInt(n, 10); i++){
                let box = document.createElement('div');
                box.classList.add("purchased-item");

                let item = document.createElement('div');
                item.classList.add('purchased-item');
                item.style.backgroundColor = selectedColor.value;

                box.appendChild(item);
                purchasedItems.appendChild(box);
            }
        };

        cancelQuantityButton.addEventListener("click", function(){
            Object.assign(selectedColor, {
                change: 0,
            });
            checkoutQuantity.value = selectedColor.quantity;   
            updateModal();        
        }, false);