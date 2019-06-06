import DiscourseURL from 'discourse/lib/url';
export default Ember.Controller.extend({
  
  actions: {
    search() {
      let searchTerm = this.get('searchTerm');
      DiscourseURL.routeTo('/search?q=' + searchTerm); 
    }
  }
});