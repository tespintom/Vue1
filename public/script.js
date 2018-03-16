// console.log('It works.');
// console.log(Vue);
// creating a new instanance of the project (constructor); el for element
var PRICE = 9.99;
var LOAD_NUM = 10;
new Vue({
  el: '#app',
  data: {
    total: 0,
    // items: [{
    //     id: 1,
    //     title: 'Item 1'
    //   },
    //   {
    //     id: 2,
    //     title: 'Item 2'
    //   },
    //   {
    //     id: 3,
    //     title: 'Item 3'
    //   },
    // ],
    items: [],
    cart: [],
    results: [],
    newSearch: 'anime',
    lastSearch: '',
    loading: false,
    price: PRICE,

  },
  computed:{
    noMoreItems: function(){
      return this.items.length === this.results.length && this.results.length > 0;
    },

  },
  methods: {
    appendItems: function(){
      if (this.items.length < this.results.length){
        var append = this.results.slice(this.items.length,this.items.length + LOAD_NUM);
        this.items = this.items.concat(append);
      }
    },
    onSubmit: function() {
      this.items = [];
      this.loading = true;
      // console.log(this.$http);
      this.$http
        .get('/search/'.concat(this.newSearch))
        .then(function(res){
          this.lastSearch = this.newSearch;
          this.results = res.data;
          this.appendItems();
          this.loading = false;
          // console.log(res);
      })
      ;
    },
    addItem: function(index) {
      // console.log(index);
      this.total += PRICE;
      var item = this.items[index];
      var found = false;
      for (var i = 0; i < this.cart.length; i++) {
        if (this.cart[i].id === item.id) {
          found = true;
          this.cart[i].qty++;
          break;
        }
      }
      if (!found) {
        this.cart.push({
          id: item.id,
          title: item.title,
          qty: 1,
          price: PRICE
        });
      }

      // this.cart.push(this.items[index]);
      // console.log(this.cart.length);
    },
    inc: function(item) {
      // console.log('inc');
      item.qty++;
      this.total += PRICE;
    },
    dec: function(item) {
      // console.log('dec');
      item.qty--;
      this.total -= PRICE;
      if (item.qty <= 0) {
        for (var i = 0; i < this.cart.length; i++) {
          if (this.cart[i].id === item.id) {
            this.cart.splice(i, 1);
          }
        }
      }
    },


  },
  filters: {
    currency: function(price) {
      return '$'.concat(price.toFixed(2));
    }
  },
  mounted: function(){
    this.onSubmit();
    var vueInstance = this;
    var elem = document.getElementById('product-list-bottom');
    var watcher = scrollMonitor.create(elem);
    watcher.enterViewport(function(){
      vueInstance.appendItems();
      // console.log('enered viewport');

    });
  }
});
