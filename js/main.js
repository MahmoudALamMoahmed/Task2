document.addEventListener("DOMContentLoaded", function () {
  const notifyButton = document.createElement("button");
  notifyButton.textContent = "Notify Me";
  notifyButton.style.padding = "10px 20px";
  notifyButton.style.borderRadius = "20px";
  notifyButton.style.cursor = "pointer";
  notifyButton.style.margin = "10px";
  document.body.appendChild(notifyButton);

  notifyButton.addEventListener("click", function () {
    displayNotification("You have been notified!");
  });

  const searchButton = document.createElement("button");
  searchButton.textContent = "Search";
  searchButton.style.padding = "10px 20px";
  searchButton.style.borderRadius = "20px";
  searchButton.style.cursor = "pointer";
  searchButton.style.margin = "10px";
  document.body.appendChild(searchButton);

  searchButton.addEventListener("click", function () {
    displayByName();
  });
});

function displayNotification(message) {
  if (Notification.permission === "granted") {
    Notification.requestPermission();

    navigator.serviceWorker
      .getRegistration()
      .then(function (registration) {
        const notification = {
          body: "This is a notification from your app!",
          icon: "../web-app.png",
          data: {
            dataOfArrival: Date.now(),
            primaryKey: 1,
          },
          actions: [
            { action: "explore", title: "Show Page", icon: "../web-app.png" },
            {
              action: "close",
              title: "Close Page",
              icon: "../web-app-icon 2.png",
            },
          ],
        };
        registration.showNotification(message, notification);
      })
      .catch((err) => console.log("Error", err));
  }
}

var idbApp = (function () {
  "use strict";

  // TODO 2 - check for support
var dbPromise = idb.open("couches", 3, function (updateDb) {
    console.log(updateDb.oldVersion);

    if (updateDb.oldVersion == 1) {
        updateDb.createObjectStore("products", { keyPath: "id" });
    } else if (updateDb.oldVersion == 2) {
        console.log("create index");
        var store = updateDb.transaction.objectStore("products");
        store.createIndex("name", "name", { unique: true });
        store.createIndex("description", "description", { unique: true });
        store.createIndex("price", "price");
    }


    // switch (updateDb.oldVersion) {
    //   case 1:
    //     // add products
    // console.log("create products collection");
    // // updateDb.createObjectStore("products", { keyPath: "id" });
    // break;
    //   case 2:
    //     console.log("create index");
    //     console.log(updateDb);
    // var store = updateDb.transaction.objectStore("products");
    // store.createIndex("name", "name", { unique: true });
    //     break;
    // }
  });

  function addProducts() {
    // TODO 3.3 - add objects to the products store
    dbPromise
      .then((db) => {
        var tx = db.transaction("products", "readwrite");
        var store = tx.objectStore("products");
        var items = [
          {
            name: "Couch",
            id: "cch-blk-ma",
            price: 499.99,
            color: "black",
            material: "mahogany",
            description: "A very comfy couch",
            quantity: 3,
          },
          {
            name: "Armchair",
            id: "ac-gr-pin",
            price: 299.99,
            color: "grey",
            material: "pine",
            description: "A plush recliner armchair",
            quantity: 7,
          },
          {
            name: "Stool",
            id: "st-re-pin",
            price: 59.99,
            color: "red",
            material: "pine",
            description: "A light, high-stool",
            quantity: 3,
          },
          {
            name: "Chair",
            id: "ch-blu-pin",
            price: 49.99,
            color: "blue",
            material: "pine",
            description: "A plain chair for the kitchen table",
            quantity: 1,
          },
          {
            name: "Dresser",
            id: "dr-wht-ply",
            price: 399.99,
            color: "white",
            material: "plywood",
            description: "A plain dresser with five drawers",
            quantity: 4,
          },
          {
            name: "Cabinet",
            id: "ca-brn-ma",
            price: 799.99,
            color: "brown",
            material: "mahogany",
            description: "An intricately-designed, antique cabinet",
            quantity: 11,
          },
        ];

        return Promise.all(
          items.map((item) => {
            return store.add(item);
          })
        )
          .catch((err) => {
            tx.abort();
          })
          .then(() => {
            console.log("Products added successfully");
          });
      })
      .catch((err) => {
        console.log("error create DB");
      });
  }

  function getByName(key) {
    // TODO 4.3 - use the get method to get an object by name
    return dbPromise.then((db) => {
      var tx = db.transaction("products", "readonly");
      var store = tx.objectStore("products");
      var index = store.index("name");
      return index.get(key);
    });
  }

  function displayByName() {
    var key = document.getElementById("name").value;
    if (key === "") {
      return;
    }
    var s = "";
    getByName(key)
      .then(function (object) {
        if (!object) {
          return;
        }
        console.log(object);
        s += "<h2>" + object.name + "</h2><p>";
        for (var field in object) {
          s += field + " = " + object[field] + "<br/>";
        }
        s += "</p>";
      })
      .then(function () {
        if (s === "") {
          s = "<p>No results.</p>";
        }
        document.getElementById("results").innerHTML = s;
      });
  }

function getByPrice(min, max) {
    return dbPromise.then(function (db) {
        var tx = db.transaction('products', 'readonly');
        var store = tx.objectStore('products');
        var index = store.index('price');
        var range = IDBKeyRange.bound(min, max);
        var results = [];

        return index.openCursor(range).then(function cursorIterate(cursor) {
            if (!cursor) return results;
            if (cursor.value.price >= min && cursor.value.price <= max) {
                results.push(cursor.value);
            }
            return cursor.continue().then(cursorIterate);
        });
    });
}




  function getByDesc() {
        return dbPromise.then((db) => {
          var tx = db.transaction("products", "readonly");
          var store = tx.objectStore("products");
          var index = store.index("description");
          return index.get(key);
        });
  }

  function addOrders() {
    // TODO 5.2 - add items to the 'orders' object store
  }

  //1)get orders
  //2)products
  //3)decrement products
  //4)update products

  function showOrders() {}

  function getOrders() {
    // TODO 5.4 - get all objects from 'orders' object store
  }

  function fulfillOrders() {
    //get orders
    //quantity
    //process order
    //update products
  }

  function processOrders(orders) {
    // TODO 5.5 - get items in the 'products' store matching the orders
  }

  function decrementQuantity(product, order) {
    // TODO 5.6 - check the quantity of remaining products
  }

  function updateProductsStore(products) {
    // TODO 5.7 - update the items in the 'products' object store
  }

  return {
    dbPromise: dbPromise,
    addProducts: addProducts,
    getByName: getByName,
    displayByName: displayByName,
    getByPrice: getByPrice,
    getByDesc: getByDesc,
    addOrders: addOrders,
    showOrders: showOrders,
    getOrders: getOrders,
    fulfillOrders: fulfillOrders,
    processOrders: processOrders,
    decrementQuantity: decrementQuantity,
    updateProductsStore: updateProductsStore,
  };
})();