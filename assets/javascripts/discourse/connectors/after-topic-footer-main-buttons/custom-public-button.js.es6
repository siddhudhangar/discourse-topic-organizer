import { arr_mapping, init_arr, current_topic_id, reverse_map, url_map, initial_selected_topics_pre, initial_selected_topic_ids_pre, initial_selected_topics_post, initial_selected_topic_ids_post } from '../../initializers/admin_button';

//var selected_topics=[];
//var selected_topic_ids = [];
var selected_topics_pre=new Set(initial_selected_topics_pre);
var selected_topic_ids_pre= new Set(initial_selected_topic_ids_pre);
var selected_topic_ids_post= new Set(initial_selected_topic_ids_post);
var selected_topics_post= new Set(initial_selected_topics_post);
 var arr=init_arr;
//var selected_topics_pre = initial_selected_topics_pre;
//var selected_topic_ids_pre = initial_selected_topic_ids_pre;
//var selected_topics_post = initial_selected_topics_post;
//var selected_topic_ids_post = initial_selected_topic_ids_post;
var post=[];
var pre=[];
export default {
  actions: {
    // fetchnotes() {
    //     this.store.findAll('note')
    //   .then(result => {
    //     for (const note of result.content) {
    //       //this.notes.pushObject(note);
    //       console.log(note);
    //     }
    //   })
    //   .catch(console.error);
    // },

    createTopicRecord() {
      // console.log(selected_topic_ids);
      if (!selected_topic_ids_pre && !selected_topic_ids_post) {
        console.log(":( the array empty");
        return;
      }
      this.set('notes', []);


      var prearr=Array.from(selected_topic_ids_pre);
      var postarr=Array.from(selected_topic_ids_post)
      const topicRecord = this.store.createRecord('note', {
        id: current_topic_id,
        prior_topic_id: prearr,
        next_topic_id: postarr
      });

      topicRecord.save()
      .then(result => {
        this.notes.pushObject(result.target);
      })
      .catch(console.error);

      showSnackbar();

      function showSnackbar() {
        // Get the snackbar DIV
        var x = document.getElementById("snackbar");

        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
      }

      $("#prereq_list").empty();
      $("#postreq_list").empty();
       var j;
      for(var elem of selected_topic_ids_pre){
       // var text="";
         var tname = url_map[parseInt(elem)];

        // var newStr = topicn.replace(/ /g, "-");
        // var tname=newStr.toLowerCase();
       // console.log(topicn+"-->"+newStr+"  "+tname);
       var text='<a class="btn btn-warning btn-xs"';
       text+='href="../';
       text+=tname;
       text+='/';
       text+=parseInt(elem);
       text+='">';
       text+=arr_mapping[parseInt(elem)];
       text+='</a>&nbsp;';
       console.log(text);
          $("#prereq_list").append(text);
        }

        for(var elem of selected_topic_ids_post){
          var lname=url_map[parseInt(elem)];

          var text='<a class="btn btn-warning btn-xs"';
          text+='href="../';
          text+=lname;
          text+='/';
          text+=parseInt(elem);
          text+='">';
          text+=arr_mapping[parseInt(elem)];
          text+='</a>&nbsp;';
       //console.log(text);
          $("#postreq_list").append(text);

        }

    },

    closeForm(){
      
      function clearset(myarr)
      {
        if(myarr)
          myarr.clear();
      }
      clearset(selected_topic_ids_pre);
       clearset(selected_topics_pre);
       clearset(selected_topic_ids_post);
       clearset(selected_topics_post);
       clearset(initial_selected_topics_pre);
       clearset(initial_selected_topics_post);
       clearset(initial_selected_topic_ids_pre);
       clearset(initial_selected_topic_ids_post);



      document.getElementById("myInput").value = '';
      document.getElementById("prereq-list").innerHTML = "";
      document.getElementById("myForm").style.display = "none";
    },

    // clearall() {

    //    function clearset(myarr)
    //   {
    //     if(myarr)
    //       myarr.clear();
    //   }
    //   clearset(selected_topic_ids_pre);
    //   clearset(selected_topic_ids_post);
    //   clearset(selected_topics_post);
    //   clearset(selected_topics_pre);

    //   if(initial_selected_topic_ids_pre){
    //     for(var elem of initial_selected_topic_ids_pre){
    //       console.log(elem);
    //       selected_topic_ids_pre.add(parseInt(elem));
    //       selected_topics_pre.add(arr_mapping[parseInt(elem)]);
    //     }
    //   }
        
    //     if(initial_selected_topic_ids_post){
    //      for(var elem of initial_selected_topic_ids_post){
    //       console.log(elem);
    //       selected_topic_ids_post.add(parseInt(elem));
    //       selected_topics_post.add(arr_mapping[parseInt(elem)]);
    //     }
    //   }


    //   //arr=arr.concat(pre.concat(post));

    // document.getElementById("prereq-list").innerHTML="";
    // document.getElementById("postreq-list").innerHTML="";
    //  // console.log(l);
    // },

    addtopic() {



      // if(!selected_topics_pre)
      // {
      //   selected_topics_pre=new Set(initial_selected_topics_pre);
      //   selected_topic_ids_pre= new Set(initial_selected_topic_ids_pre);
      // }

      // console.log("initial stuff and sele");
      //   console.log(initial_selected_topic_ids_pre);
      //   console.log(initial_selected_topic_ids_post);
      //   for(var elem of initial_selected_topic_ids_pre){
      //     console.log(elem);
      //     selected_topic_ids_pre.add(elem);
      //     selected_topics_pre.add(arr_mapping[parseInt(elem)]);
      //   }


        console.log(selected_topic_ids_pre);
        console.log(selected_topic_ids_post);
        

      var x =Array.from(document.getElementsByClassName("autocomplete-items"));
      var y=x[0];
      var z=Array.from(y.children);
      // var selected_topics=[];
      // selected_topic_ids = [];
      // var prereq=document.getElementById("myInput").value;
      // var flagv=document.getElementById("flag").value;
     // console.log(x);
      //console.log(typeof z[0]);
      //console.log(z);
    //  var c=x.childNodes;
      for (var i = 0; i < z.length; i++) {
        //console.log(z[i].id);
        //console.log(typeof z[i].id);
        var ch_id='check'+z[i].id;
        var prereq=z[i].id;
        var flagv=document.getElementById(ch_id).checked;
        if(flagv==true){
          // console.log(prereq);
          // var l,x;
          var l,x,l2;
          l = document.getElementById("prereq-list");
          l2= document.getElementById("postreq-list");
          x = document.createElement("DIV");
          x.setAttribute("class", "chip");
          x.setAttribute("id", prereq);
          x.setAttribute("padding","100px")

          /* if(document.getElementById("pre").checked) {
             selected_topics_pre.add(prereq);
             selected_topic_ids_pre.add(reverse_map[prereq]);
           }

           else if(document.getElementById("post").checked) {
             selected_topics_post.add(prereq);
             selected_topic_ids_post.add(reverse_map[prereq]);
           }
          */
          x.innerHTML=prereq;
          //x.innerHTML+="<span class='closebtn'>&times;</span>";
          var clb=document.createElement("SPAN");
          clb.setAttribute("class","closebtn");
          clb.setAttribute("id",prereq+"-button");

          clb.innerHTML='&times;';
          console.log(clb);

          // var buttn=document.createElement("BUTTON");
          // // buttn.setAttribute("type","close");
          // clb.addEventListener("onclick",function(e){
          //   console.log("inside addEventListener"+e.target.id);
          // });

        //  x.appendChild(buttn);

         // document.getElementsByClassName('closebtn').onclick = function() { 
          x.appendChild(clb);

          console.log("its working..");
           // document.getElementById("id").remove(); 

          // console.log(x);
          // console.log(x.innerHTML);
          // console.log(x.children);


          if(document.getElementById("pre").checked && !selected_topics_post.has(prereq)){
            selected_topics_pre.add(prereq);
            selected_topic_ids_pre.add(reverse_map[prereq]);
            pre.push(prereq);
            l.innerHTML += '&nbsp;'; 
          l.appendChild(x);  
          }
          else if(document.getElementById("pre").checked && selected_topics_post.has(prereq)){
            alert(prereq+ ":Topic already present as a Post-Requisite!");
          }
          else if(document.getElementById("post").checked && !selected_topics_pre.has(prereq)){
            selected_topics_post.add(prereq);
            selected_topic_ids_post.add(reverse_map[prereq]);
            post.push(prereq);
            l2.innerHTML += '&nbsp;'; 
          l2.appendChild(x);  
          }
          else if(document.getElementById("post").checked && selected_topics_pre.has(prereq)){
            alert(prereq+ ":Topic already present as a Pre-Requisite!")
          }




          // l.innerHTML += '&nbsp;'; 
          // l.appendChild(x);     
        }
      }

      var plist=document.getElementsByClassName("closebtn");

     // console.log(plist[0]);
      for(var j=0;j<plist.length;j++) {
        plist[j].addEventListener("click",function(e) {
            // body...
            var idn=e.target.parentNode.id;
            console.log(idn);
            document.getElementById(idn).remove();
            // var k=selected_topics.indexOf(idn);

            // selected_topics.splice(k,1);
            
            if(document.getElementById("pre").checked) {
              //var k = selected_topics_pre.indexOf(idn);
             // var k1 = selected_topic_ids_pre.indexOf(reverse_map.get(idn));
              selected_topics_pre.delete(idn);
              selected_topic_ids_pre.delete(reverse_map[idn]);
              if(!arr.includes(idn))
              arr.push(idn);
            }

            else if(document.getElementById("post").checked) {
              //var k = selected_topics_post.indexOf(idn);
              //var k1 = selected_topic_ids_post.indexOf(reverse_map.get(idn));
              selected_topics_post.delete(idn);
              selected_topic_ids_post.delete(reverse_map[idn]);
              if(!arr.includes(idn))
              arr.push(idn);
            }
          });

        console.log("plZZZZ");
        console.log(selected_topic_ids_post);
        console.log(selected_topic_ids_pre);


      }


      var br = document.createElement('br'); 
      document.getElementById("myInput").value = '';
      closeAllLists();
      
      console.log(selected_topic_ids_post+"  "+selected_topic_ids_pre);
      function closeAllLists(elmnt) {
          /*close all autocomplete lists in the document,
           except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
          if (elmnt != x[i]) {
            x[i].parentNode.removeChild(x[i]);
          }
        }
      }

      //this. autocomplete();
      // this.sendAction('createTopicRecord', selected_topic_ids);

      // this.send('autocomplete', selected_topics);
      
      //this.send('autocomplete', selected_topics_pre,selected_topics_post);
    

    },

    autocomplete() {




      console.log("auto stuff and sele");
        console.log(initial_selected_topic_ids_pre);
        console.log(initial_selected_topic_ids_post);
        if(initial_selected_topic_ids_pre){
        for(var elem of initial_selected_topic_ids_pre){
          console.log(elem);
          selected_topic_ids_pre.add(parseInt(elem));
          selected_topics_pre.add(arr_mapping[parseInt(elem)]);
        }
      }
        
        if(initial_selected_topic_ids_post){
         for(var elem of initial_selected_topic_ids_post){
          console.log(elem);
          selected_topic_ids_post.add(parseInt(elem));
          selected_topics_post.add(arr_mapping[parseInt(elem)]);
        }
      }


        console.log(arr);
        console.log(selected_topic_ids_pre);
        console.log(selected_topics_pre);










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

        var x;

        var selected_topics=new Set();

        /*if(document.getElementById("pre").checked)
          selected_topics = selected_topics_pre;

        else if(document.getElementById("post").checked)
          selected_topics = selected_topics_post;*/
        for(var elem of selected_topics_pre)
          selected_topics.add(elem);

        for(var elem of selected_topics_post)
          selected_topics.add(elem);

        /*if(selected_topics) {
          for(x = 0; x<selected_topics.length; x++) {
            var index = arr.indexOf(selected_topics[x]);
            if(index != -1) {
              arr.splice(index, 1);
            }
          }
        }*/
        console.log(selected_topics);
        if(selected_topics)
        {
          for(var elem of selected_topics)
          {
            var index = arr.indexOf(elem);
            if(index != -1) {
              arr.splice(index, 1);
            }
          }
        }

        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            b.setAttribute("id",arr[i]);
            b.setAttribute("align","left");
            flag=true;

            var pos=arr[i].toUpperCase().indexOf(val.toUpperCase());

            b.innerHTML = "<input id='check"+arr[i]+"' type='checkbox' value='" + arr[i] + "'>";
            b.innerHTML+='&nbsp;';
            b.innerHTML+= arr[i].substr(0,pos);

            b.innerHTML+="<strong>" + arr[i].substr(pos, val.length) + "</strong>";

            // b.innerHTML=arr[i].substr(0,pos);
            // /*make the matching letters bold:*/
            // b.innerHTML = "<strong>" + arr[i].substr(pos, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(pos+val.length);
            /*insert a input field that will hold the current array item's value:*/
          //  b.innerHTML += "<input id='check"+arr[i]+"' type='checkbox' align='right' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              //  inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                document.getElementById("flag").value="true";
               // closeAllLists();
             });
            a.appendChild(b); 
          }
        }

        if(!flag) {
          var notfound=document.createElement("DIV");
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
        } 
        else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } 
        else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) {
              x[currentFocus].click();
            }
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
     // closeAllLists(e.target);
   });
}


}
};


  // export {
  //   selected_topic_ids,
  //   current_topic_id
  // };