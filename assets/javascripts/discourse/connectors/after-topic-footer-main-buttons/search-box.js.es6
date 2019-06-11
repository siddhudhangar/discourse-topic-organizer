export default{
  /*actions:{
    myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
    }
    
  }*/
  var pg = require(‘pg’);
  var connectionString = "postgres://postgres:hbcse@postgresql/ip:5432/discourse_development";
  var pgClient = new pg.Client(connectionString);
  pgClient.connect();
  var query = pgClient.query("SELECT title from topics");
  query.on("row", function(row,result){
    result.addRow(row);
  });

}
