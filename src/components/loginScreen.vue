<template>
  <v-sheet class="pa-12" rounded style="background: #193441">
    <!--Top Nav Bar-->
    <v-app-bar app style="background-color: #34424d" dark>
      <v-toolbar-title style="margin: 0 auto; font-size: 2.5rem; color: #f5f5f5">
        Ivan & Joseph's Clothing Factory
      </v-toolbar-title>


      <v-btn v-if="orderHistory || checkingOut || transactionHistory" @click="goBackToOrdering" color="error"> Go Back
      </v-btn>

      <v-btn v-if="logOut && !transactionHistory" @click="reset" color="error">
        Logout
      </v-btn>
      <v-btn v-if="creatingAccount" @click="reset" color="error">
        Back to login
      </v-btn>
    </v-app-bar>

    <!--Create an account page-->
    <v-card v-if="creatingAccount" class="mx-auto px-6 py-8" style="background-color: #f5f5f5" width="40rem"
      height="29rem" rounded>
      <v-form v-model="form" @submit.prevent="">
        <h1 style="text-align: center; color: #193441">Create Account</h1>

        <v-text-field v-model="firstname" class="mb-2" clearable label="First Name"
          style="color: #193441; background-color: #f5f5f5"></v-text-field>

        <v-text-field type="lastname" v-model="lastname" clearable label="Last Name" placeholder="Enter your Last Name"
          style="color: #193441; background-color: #f5f5f5"></v-text-field>

        <v-text-field type="username" v-model="username" clearable label="Username" placeholder="Enter a Username"
          style="color: #193441; background-color: #f5f5f5"></v-text-field>

        <v-text-field type="password" v-model="newPassword" clearable label="Password" placeholder="Enter your Password"
          style="color: #193441; background-color: #f5f5f5"></v-text-field>

        <br />

        <v-btn @click="createUserAccount" block color="success" size="large" type="submit" variant="elevated"
          style="background-color: #f5f5f5">
          Create Account
        </v-btn>
        <v-snackbar v-model="snackbar" :timeout="timeout" color="error">
          {{ errorMessage }}
        </v-snackbar>
      </v-form>
    </v-card>

    <!--Loggin in Screen-->
    <v-card v-if="showForm && !creatingAccount" class="mx-auto px-6 py-8" style="background-color: #f5f5f5" width="40rem"
      height="25rem" rounded>
      <v-form v-model="form" @submit.prevent="">
        <h1 style="text-align: center; color: #193441">Login</h1>
        <v-text-field v-model="email" :readonly="loading" class="mb-2" clearable label="Username"
          style="color: #193441; background-color: #f5f5f5"></v-text-field>

        <v-text-field type="password" v-model="password" :readonly="loading" clearable label="Password"
          placeholder="Enter your password" style="color: #193441; background-color: #f5f5f5"></v-text-field>

        <br />

        <v-btn @click="onSubmit" :disabled="!form" :loading="loading" block color="success" size="large" type="submit"
          variant="elevated">
          Sign In
        </v-btn>
        <br />
        <v-btn v-if="showForm && !creatingAccount" @click="createAccount" color="success" block size="large"
          type="submit">
          Create Account
        </v-btn>
      </v-form>
    </v-card>

    <!--Order History page-->
    <v-data-table v-if="orderHistory" :headers="headers" :items="orders" :items-per-page="5" class="elevation-1"
      style="background-color: #f5f5f5; color: #193441">
    </v-data-table>

    <!--Shop Page-->
    <v-container class="bg-surface-variant"
      v-if="!showForm && !creatingAccount && !orderHistory && !checkingOut && !transactionHistory">
      <v-row no-gutters>
        <v-col v-for="n in this.inventory[0].length" :key="n" cols="12" sm="4">
          <v-sheet class="ma-6 pa-8">
            <div style="text-align: center; font-weight: bold;"> {{ inventory[0][n - 1].itemName }}</div>
            <div style="text-align: center;"> {{ inventory[0][n - 1].description }}</div>
            <div style="text-align: center;" class="ma-3">
              Minimum Order amount:
              {{ inventory[0][n - 1].minimumCreation }}
            </div>
            <div style="text-align: right;" class="ma-2 pa-2">
              <v-btn style="float: left;" color="success" @click="addToCart(inventory[0][n - 1])">Add to Cart</v-btn>
              ${{ inventory[0][n - 1].cost }}
            </div>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>

    <!--Bottom Nav Bar-->
    <v-bottom-navigation class="mx-auto px-6 py-8"
      v-if="!showForm && !creatingAccount && !orderHistory && !transactionHistory"
      style="position: fixed; bottom: 0; left: 0; width: 100%; height: 5rem; display: flex; justify-content: space-between; align-items: center;">
      Total: ${{ this.total }}
      <div>
        <v-btn v-if="!checkingOut" @click="getTransactions">
          <v-icon>mdi-history</v-icon>
          <span>Transaction History</span>
        </v-btn>

        <v-btn v-if="!checkingOut && cartHasStuff" @click="clearCart">
          <v-icon>mdi-cart-remove</v-icon>
          <span>Clear Cart</span>
        </v-btn>
        <v-btn v-if="!checkingOut && !transactionHistory" @click="getOrders">
          <v-icon>mdi-history</v-icon>
          <span>Order History</span>
        </v-btn>
        <v-btn v-if="!checkingOut && cartHasStuff" @click="checkout">
          <v-icon>mdi-cart-arrow-down</v-icon>
          <span>Checkout</span>
        </v-btn>
        <v-btn v-if="checkingOut" @click="placeOrder">
          <v-icon>mdi-cart-check</v-icon>
          <span>Place Order</span>
        </v-btn>
      </div>
    </v-bottom-navigation>

    <!--Checkout Page-->
    <v-container class="bg-surface-variant" v-if="checkingOut">
      <v-data-table :headers="cartHeaders" :items="cart" :items-per-page="50" class="elevation-1"
        style="background-color: #f5f5f5; color: #193441">
      </v-data-table>
    </v-container>

    <!--Transaction History page-->
    <v-data-table v-if="transactionHistory" :headers="transactionHeaders" :items="transactions" :items-per-page="5"
      class="elevation-1" style="background-color: #f5f5f5; color: #193441">
    </v-data-table>

    <!--Error snackbar-->
    <v-snackbar v-model="snackbar" :timeout="timeout" color="error">
      {{ errorMessage }}
    </v-snackbar>

    <!--Success Snackbar-->
    <v-snackbar v-model="successSnack" :timeout="timeout" color="success">
      {{ successMessage }}
    </v-snackbar>

  </v-sheet>
</template>

<script>
import orderService from "../services/orderService";
import userService from "../services/userService";
import inventoryService from "../services/inventoryService";
import transactionService from "../services/transactionService";

export default {
  data: () => ({
    transactionHistory: false,
    successSnack: false,
    snackbar: false,
    successMessage: "Welcome!",
    errorMessage: "Error, incorrect username or password",
    timeout: 2000,
    showForm: true,
    form: false,
    email: "",
    password: null,
    loading: false,
    creatingAccount: false,
    orderHistory: false,
    cartHasStuff: false,
    checkingOut: false,
    userId: "",
    total: 0,
    logOut: false,

    firstname: "",
    lastname: "",
    username: "",
    newPassword: "",

    headers: [
      {
        text: "Order ID",
        align: "start",
        sortable: false,
        value: "orderId",
      },
      { text: "Order Date", value: "orderDate" },
      { text: "Delivery Date", value: "deliveryDate" },
      { text: "Quantity", value: "quantity" },
      { text: "Total Cost", value: "cost" },

    ],
    cartHeaders: [

      { text: "Item Name", value: "itemName" },
      { text: "Quantity", value: "minimumCreation" },
      { text: "Price", value: "cost" },

    ],
    transactionHeaders: [
      { text: "ID", value: "itemId" },
      { text: "Transaction Type", value: "transactionType" },
      { text: "Trnasaction Date", value: "transactionDate" },
      { text: "Description", value: "description" }
    ],
    transactions: [],
    orders: [],
    inventory: [],
    cart: [],
  }),

  methods: {
    createAccount() {
      this.creatingAccount = true;
    },
    getOrders() {
      this.orderHistory = true
      this.logOut = false
      orderService.getOrders(this.email).then((Response) => {
        this.orders = Response.data;
      });
    },
    reset() {
      this.showForm = true;
      this.creatingAccount = false;
      this.orderHistory = false;
      this.orders.splice(0, this.orders.length);
      this.email = "";
      this.password = "";
      this.errorMessage = "Error, incorrect username or password";
      this.newPassword = "";
      this.username = "";
      this.lastname = "";
      this.firstname = "";
      this.cartHasStuff = false;
      this.userId = "";
      this.total = 0;
      this.cart.splice(0, this.cart.length);
      this.logOut = false;
      this.transactionHistory = false;
    },
    onSubmit() {
      var temp = this.email;
      temp = temp.toLowerCase();
      temp = temp.replace(/\s/g, "");
      if (!temp || !this.password) {
        this.errorMessage = "Please fill out all fields"
        this.snackbar = true;
        setTimeout(() => (this.loading = false), 500);
      } else {
        userService.getUsers(temp, this.password).then((value) => {
          if (value != null) {
            var message = value.data.split(" ");
            if (message[1] === ("Successful")) {
              this.userId = message[2];
              this.successSnack = true;
              setTimeout(() => (this.showForm = false), 1000);
              setTimeout(() => (this.loading = false), 500);
              this.logOut = true;
              this.getItems();
            }
          } else {
            this.snackbar = true;
            this.loading = true;
            setTimeout(() => (this.loading = false), 500);
          }
        });
      }
    },
    createUserAccount() {
      const user = {
        firstname: this.firstname,
        lastname: this.lastname,
        username: this.username,
        passwordHash: this.newPassword,
      };
      if (!this.firstname || !this.lastname || !this.username || !this.newPassword) {
        // At least one of the variables is empty
        this.errorMessage = "Please fill out all textboxes";
        this.snackbar = true;
        this.loading = true;
        setTimeout(() => (this.loading = false), 500);
      } else {
        userService.registerAccount(user).then((data) => {
          if (data == true) {
            this.reset();
          } else {
            this.errorMessage = "Username already taken";
            this.snackbar = true;
            this.loading = true;
            setTimeout(() => (this.loading = false), 500);
          }
        });
      }

    },
    getItems() {
      inventoryService.getInventory().then(Response => {
        this.inventory.push(Response.data);
      });
    },
    addToCart(item) {
      this.cart.push(item);
      this.total += parseFloat(item.cost);
      this.total = parseFloat(this.total.toFixed(2));
      this.cartHasStuff = true;
    },
    checkout() {
      if (this.total > 2000) {
        this.errorMessage = "Cart total cannot exceed $2000"
        this.snackbar = true;

      } else {
        this.checkingOut = true;
        this.logOut = false;
      }
    },
    goBackToOrdering() {
      this.orderHistory = false;
      this.checkingOut = false
      this.logOut = true;
      this.transactionHistory = false;
    },
    placeOrder() {
      orderService.placeOrder(this.email, this.cart);
      this.clearCart();
      this.goBackToOrdering();
    },
    clearCart() {
      this.cart.splice(0, this.cart.length);
      this.cartHasStuff = false;
      this.total = 0;
    },
    getTransactions() {
      this.transactionHistory = true;
      transactionService.getTransaction().then(response => {
        this.transactions = response.data;
      });
    }
  },
};
</script>
