export default {
  actions: {
    clickButton() {
      //const url = this.siteSettings.topic_group_button_url.replace('<TOPIC_ID>', this.get('topic.id')).replace('<USER_ID>', this.currentUser.id).replace('<USERNAME>', this.currentUser.username);
      //window.open(url, 'popUpWindow','height=500,width=500,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');
  document.getElementById("myForm").style.display = "block";
    },
    closeForm(){
      document.getElementById("myInput").value = '';
      document.getElementById("prereq-list").innerHTML = "";
      document.getElementById("myForm").style.display = "none"; 
    },
    closebutton(prereq){
     // var l,x;
     // l = document.getElementById("prereq-list");
     document.getElementById(prereq).remove();
      //l.removeChild(x);
    },
    addtopic(){
      var prereq=document.getElementById("myInput").value;
      var flagv=document.getElementById("flag").value;
      if(prereq!=""&&flagv=="true"){
      console.log(prereq);
      var l,x;
      l = document.getElementById("prereq-list");
      x = document.createElement("DIV");
      x.setAttribute("class", "chip");
      x.setAttribute("id", prereq);
      x.innerHTML=prereq;
      x.innerHTML+="<span class='closebtn' {{action 'closebutton' this.id}}>&times;</span>"
      l.innerHTML += '&nbsp;'; 
      l.appendChild(x);     
      var br = document.createElement('br'); 
      document.getElementById("myInput").value = '';
    }

      //l.appendChild(br);
    },
    autocomplete() {
  // var temp;
  // var t1=[];
  // fetch('http://localhost:9292/latest.json')
  //   .then(function(response){
  //     return response.json();
  //   })
  //   .then(function(myJSON){
  //     temp = JSON.parse(JSON.stringify(myJSON['topic_list']['topics']));
  //     // t1.push(JSON.parse(temp[0]));
  //   });
  //   console.log(temp);
  //   console.log(temp.pop());
  //   var arr=[]; 
  //   for(const item of t1){
  //     arr.push(item['title']);
  //   }
  //   console.log(arr.length);

  var arr = [];
  var i;

  // var temp;

  fetch('http://localhost:9292/latest.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(myJSON) {
      var temp = myJSON['topic_list']['topics'];
      for (i = 0; i<temp.length; i++) {
        console.log(temp[i].title);
        arr.push(temp[i].title);
      }
      // console.log(temp);
      // for (var key in temp) {
      //   if(temp.hasOwnProperty(key)) {
      //     var item = temp[key];
      //     arr.push({
      //       id: item.id;
      //       title: item.title;
      //     })
      //   }
      // }
    });

  // $.getJSON('http://localhost:9292/latest.json', function(json) {
  //   var arr = [];
  //   for (var key in json) {
  //     if (key == 'topic_list') {
  //       for (var innerKey in json[key]) {
  //         if
  //         if(json.hasOwnProperty(key)) {
  //           var item = json[key][innerKey];
  //           arr.push({
  //             id: item.id;
  //             title: item.title;
  //           })
  //         }
  //       }
  //     }
  //   }
  // });
  
  console.log(arr);
  var inp=document.getElementById("myInput");
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/

      var flag=false;
      document.getElementById("flag").value="false";
     
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
      //  if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/

          if(arr[i].toUpperCase().includes(val.toUpperCase())){
          b = document.createElement("DIV");
         b.setAttribute("align","left");
          flag=true;
          
          /*make the matching letters bold:*/
          
          var pos=arr[i].toUpperCase().indexOf(val.toUpperCase());
         
          b.innerHTML = arr[i].substr(0,pos);
         
          b.innerHTML+="<strong>" + arr[i].substr(pos, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(pos+val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='checkbox' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              document.getElementById("flag").value="true";
              closeAllLists();


          });
          a.appendChild(b);
        }

      }

      if(!flag)
      {
        var notfound= document.createElement("DIV");
         notfound.setAttribute("align","left");
         notfound.innerHTML="Not Found...";
         a.appendChild(notfound);
      }



  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}

  }
};


