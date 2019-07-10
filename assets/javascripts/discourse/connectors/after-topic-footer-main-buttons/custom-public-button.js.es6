import { arr_mapping, init_arr, current_topic_id, reverse_map, url_map, initial_selected_topics_pre, initial_selected_topic_ids_pre, initial_selected_topics_post, initial_selected_topic_ids_post, init_pre, init_post } from '../../initializers/admin_button';

var selected_topics_pre = new Set(initial_selected_topics_pre);
var selected_topic_ids_pre = new Set(initial_selected_topic_ids_pre);
var selected_topic_ids_post = new Set(initial_selected_topic_ids_post);
var selected_topics_post = new Set(initial_selected_topics_post);
var arr = init_arr;

var pre = init_pre.slice();
var post = init_post.slice();

var noOfPreTopicsAdded = 0;
var noOfPostTopicsAdded = 0;

export default {
  actions: {

    createTopicRecord() {
      console.log("initial arr:");
      console.log(initial_selected_topic_ids_pre);
      console.log(initial_selected_topic_ids_post);
      this.send('autocomplete');
      console.log("pre:");
      console.log(selected_topic_ids_pre);
      console.log("post:");
      console.log(selected_topic_ids_post);

      if (!selected_topic_ids_pre && !selected_topic_ids_post) {
        console.log(":( the array empty");
        return;
      }
      this.set('notes', []);
      var prearr = Array.from(selected_topic_ids_pre);
      var postarr = Array.from(selected_topic_ids_post);

      var prearr = new Set(prearr);
      var postarr = new Set(postarr);

      var prearr = Array.from(selected_topic_ids_pre);
      var postarr = Array.from(selected_topic_ids_post);

      this.store.findAll('note')
        .then(result => {
          for (const selectedTopicIdPre of prearr) {
            var prereqsAreTheSame;
            var postreqsToBeAdded;
            var isSequenceOn;
            var recordExistsFlag = false;

            for (const note of result.content) {
              if (note['id'] == selectedTopicIdPre) {
                recordExistsFlag = true;
                prereqsAreTheSame = note['prior_topic_id'];
                postreqsToBeAdded = note['next_topic_id'];
                isSequenceOn = note['sequence_on'];

                if (!postreqsToBeAdded.includes("" + current_topic_id)) {
                  // console.log("checking if includes");
                  // console.log(postreqsToBeAdded);
                  postreqsToBeAdded.push("" + current_topic_id);
                  if (isSequenceOn == "true") {
                    if (postreqsToBeAdded.length > 1)
                      isSequenceOn = "false";
                  }
                }
                break;
              }
            }

            if (!recordExistsFlag) {
              postreqsToBeAdded = [];
              postreqsToBeAdded.push(current_topic_id);
              isSequenceOn = "false";
            }

            prereqsAreTheSame = new Set(prereqsAreTheSame);
            postreqsToBeAdded = new Set(postreqsToBeAdded);
            const topicRecord = this.store.createRecord('note', {
              id: selectedTopicIdPre,
              prior_topic_id: Array.from(prereqsAreTheSame),
              next_topic_id: Array.from(postreqsToBeAdded),
              sequence_on: isSequenceOn
            });

            topicRecord.save()
              .then(result => {
                this.notes.pushObject(result.target);
              })
              .catch(console.error);

          }


          for (const selectedTopicIdPost of postarr) {
            var prereqsToBeAdded;
            var postreqsAreTheSame;
            var isSequenceOn;
            var recordExistsFlag = false;

            for (const note of result.content) {
              if (note['id'] == selectedTopicIdPost) {
                recordExistsFlag = true;
                prereqsToBeAdded = note['prior_topic_id'];
                postreqsAreTheSame = note['next_topic_id'];
                isSequenceOn = note['sequence_on'];

                if (!prereqsToBeAdded.includes("" + current_topic_id)) {
                  prereqsToBeAdded.push("" + current_topic_id);
                  if (isSequenceOn == "true") {
                    if (prereqsToBeAdded.length > 1)
                      isSequenceOn = "false";
                  }
                }
                break;
              }
            }

            if (!recordExistsFlag) {
              prereqsToBeAdded = [];
              prereqsToBeAdded.push(current_topic_id);
              isSequenceOn = "false";
            }

            prereqsToBeAdded = new Set(prereqsToBeAdded);
            postreqsAreTheSame = new Set(postreqsAreTheSame);
            const topicRecord = this.store.createRecord('note', {
              id: selectedTopicIdPost,
              prior_topic_id: Array.from(prereqsToBeAdded),
              next_topic_id: Array.from(postreqsAreTheSame),
              sequence_on: isSequenceOn
            });

            topicRecord.save()
              .then(result => {
                this.notes.pushObject(result.target);
              })
              .catch(console.error);

          }
        });

      const topicRecord = this.store.createRecord('note', {
        id: current_topic_id,
        prior_topic_id: prearr,
        next_topic_id: postarr,
        sequence_on: "" + document.getElementById("sequencer_checkbox").checked
      });

      topicRecord.save()
        .then(result => {
          this.notes.pushObject(result.target);
        })
        .catch(console.error);


      function showSnackbar() {
        // Get the snackbar DIV
        var x = document.getElementById("snackbar");

        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function() { x.className = x.className.replace("show", ""); }, 3000);
      }

      $("#prereq_list").empty();
      $("#postreq_list").empty();
      var j;
      for (var elem of selected_topic_ids_pre) {
        // var text="";
        var tname = url_map[parseInt(elem)];
        var text = '<a class="btn btn-warning btn-xs"';
        text += 'href="http://localhost:9292/t/';
        text += tname;
        text += '/';
        text += parseInt(elem);
        text += '">';
        if (selected_topic_ids_pre.length == 1)
          text += 'Prev';
        else
          text += arr_mapping[parseInt(elem)];
        text += '</a>&nbsp;';
        console.log(text);
        $("#prereq_list").append(text);
      }

      for (var elem of selected_topic_ids_post) {
        var lname = url_map[parseInt(elem)];

        var text = '<a class="btn btn-warning btn-xs"';
        text += 'href="http://localhost:9292/t/';
        text += lname;
        text += '/';
        text += parseInt(elem);
        text += '">';
        if (selected_topic_ids_pre.length == 1)
          text += 'Next';
        else
          text += arr_mapping[parseInt(elem)];
        text += '</a>&nbsp;';
        $("#postreq_list").append(text);
      }

      // noOfPostTopicsAdded = 0;
      // noOfPreTopicsAdded = 0;

      window.setTimeout(this.send("closeForm"), 5000);

      showSnackbar();

    },
    displayprepost()
    {
      //this.send("autocomplete");
      document.getElementById("prereq-list").innerHTML="";
      document.getElementById("postreq-list").innerHTML="";
    //  initial_selected_topic_ids_pre = new Set(initial_selected_topic_ids_pre);
     // initial_selected_topic_ids_post = new Set(initial_selected_topic_ids_post);



      if (initial_selected_topic_ids_pre) {
        for (var elem of initial_selected_topic_ids_pre) {
          console.log(elem);
          selected_topic_ids_pre.add(parseInt(elem));
          selected_topics_pre.add(arr_mapping[parseInt(elem)]);
        }
      }

      if (initial_selected_topic_ids_post) {
        for (var elem of initial_selected_topic_ids_post) {
          console.log(elem);
          selected_topic_ids_post.add(parseInt(elem));
          selected_topics_post.add(arr_mapping[parseInt(elem)]);
        }
      }



      for(var elem of initial_selected_topics_pre){
          var l, x, l2;
          l = document.getElementById("prereq-list");
          l2 = document.getElementById("postreq-list");
          x = document.createElement("DIV");
         // x.setAttribute("class", "chip");
          x.setAttribute("id", elem);
          x.setAttribute("padding", "100px");
          x.innerHTML = elem;

          var clb = document.createElement("SPAN");
          clb.setAttribute("class", "closebtn");
          clb.setAttribute("id", elem + "-button");

          clb.innerHTML = '&times;';
          console.log(clb);


          x.appendChild(clb);
          pre.push(elem);
            l.innerHTML += '&nbsp;';
            l.appendChild(x);
      }

      for(var elem of initial_selected_topics_post){
          var l, x, l2;
          l = document.getElementById("prereq-list");
          l2 = document.getElementById("postreq-list");
          x = document.createElement("DIV");
         // x.setAttribute("class", "chip");
          x.setAttribute("id", elem);
          x.setAttribute("padding", "100px");
          x.innerHTML = elem;

          var clb = document.createElement("SPAN");
          clb.setAttribute("class", "closebtn");
          clb.setAttribute("id", elem + "-button");

          clb.innerHTML = '&times;';
          console.log(clb);


          x.appendChild(clb);
          post.push(elem);
            l2.innerHTML += '&nbsp;';
            l2.appendChild(x);
      }


          var plist = document.getElementsByClassName("closebtn");

          console.log("plist.length: "+plist.length);

          // console.log(plist[0]);
          for (var j = 0; j < plist.length; j++) {
            plist[j].addEventListener("click", function(e) {
              // body...
              var idn = e.target.parentNode.id;
              console.log(idn);
              document.getElementById(idn).remove();
              
                // noOfPreTopicsAdded -= 1;
                selected_topics_pre.delete(idn);
               selected_topic_ids_pre.delete(reverse_map[idn]);
                if (!arr.includes(idn)) {
                  arr.push(idn);
                }
              
                // noOfPostTopicsAdded -= 1;
               selected_topics_post.delete(idn);
               selected_topic_ids_post.delete(reverse_map[idn]);
                if (!arr.includes(idn)) {
                  arr.push(idn);
                }
            });
          }


    },

    closeForm() {

      function clearset(myarr) {
        if (myarr)
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
      document.getElementById("postreq-list").innerHTML = "";
      document.getElementById("myForm").style.display = "none";

      noOfPostTopicsAdded = 0;
      noOfPreTopicsAdded = 0;
    },


    checkIfSequencerValid() {
      // console.log("checkIfSequencerValid called");
      // console.log(initial_selected_topic_ids_pre);
      console.log(noOfPreTopicsAdded);
      if (((initial_selected_topic_ids_pre && (initial_selected_topic_ids_pre.length + noOfPreTopicsAdded) >= 1) || (noOfPreTopicsAdded >= 1)) && ((initial_selected_topic_ids_post && (initial_selected_topic_ids_post.length + noOfPostTopicsAdded) >= 1) || (noOfPostTopicsAdded >= 1))) {
        document.getElementById("sequencer_checkbox").checked = false;
        alert("Sequencer is not valid for your current selection of topics. Turning sequencer off.");
      } else if (document.getElementById("sequencer_checkbox").checked) {
        alert("Sequencing is on. At most one pre and one post topic may be added");
      } else if (!document.getElementById("sequencer_checkbox").checked) {
        document.getElementById("myInput").disabled = false;
      }
    },

    checkIfSequencerValidForPre() {
      if (document.getElementById("sequencer_checkbox").checked) {
        if (((initial_selected_topic_ids_pre && (initial_selected_topic_ids_pre.length + noOfPreTopicsAdded) >= 1) || (noOfPreTopicsAdded >= 1)))
          document.getElementById("myInput").disabled = true;
        else
          document.getElementById("myInput").disabled = false;
      }
    },

    checkIfSequencerValidForPost() {
      if (document.getElementById("sequencer_checkbox").checked) {
        if (((initial_selected_topic_ids_post && (initial_selected_topic_ids_post.length + noOfPostTopicsAdded) >= 1) || (noOfPostTopicsAdded >= 1)))
          document.getElementById("myInput").disabled = true;
        else
          document.getElementById("myInput").disabled = false;
      }
    },

    /*
     clearall() {
      selected_topics_pre = initial_selected_topics_pre;
      selected_topic_ids_pre = initial_selected_topic_ids_pre;
      selected_topics_post = initial_selected_topics_post;
      selected_topic_ids_post = initial_selected_topic_ids_post;
      var l=document.getElementById("prereq-list").innerHTML="";
      document.getElementById("postreq-list").innerHTML="";

     // console.log(l);
    },
    */

    addtopic() {

      // if(!document.getElementById("pre").checked && !document.getElementById("post").checked)
      //   alert("You have not selected one of pre/post");
      //   
      console.log(initial_selected_topics_pre);

      var x = Array.from(document.getElementsByClassName("autocomplete-items"));
      var y = x[0];
      var z = Array.from(y.children);
      console.log(z);

      function returnNumberOfChecked(z) {
        var count = 0;
        for (var i = 0; i < z.length; i++) {
          var ch_id = 'check' + z[i].id;
          if (document.getElementById('check' + z[i].id).checked)
            count += 1;
        }
        return count;
      }

      if (document.getElementById("pre").checked) {
        // console.log("z.length: "+z.length);
        noOfPreTopicsAdded += returnNumberOfChecked(z);
      } else if (document.getElementById("post").checked) {
        // console.log("z.length: "+z.length);
        noOfPostTopicsAdded += returnNumberOfChecked(z);
      }

      // console.log("noOfPreTopicsAdded: "+noOfPreTopicsAdded);

      // if (document.getElementById("sequencer_checkbox").checked) {
      //   if(document.getElementById("pre").checked) {
      //     if(noOfPreTopicsAdded>=1)
      //       document.getElementById("myInput").disabled = true;
      //     else
      //       document.getElementById("myInput").disabled = false;
      //   }
      //   else {
      //     if(noOfPostTopicsAdded>=1)
      //       document.getElementById("myInput").disabled = true;
      //     else
      //       document.getElementById("myInput").disabled = false;
      //   }
      //   // if ((noOfPreTopicsAdded >= 1) || (noOfPostTopicsAdded >= 1)) {
      //   //   document.getElementById("myInput").disabled = true;
      //   //   // alert("Sequencer is not valid for your current selection of topics. Turning sequencer off.");
      //   //   // if (document.getElementById("pre").checked) {
      //   //   //   // console.log("z.length: "+z.length);
      //   //   //   noOfPreTopicsAdded -= returnNumberOfChecked(z);
      //   //   // } else if (document.getElementById("post").checked) {
      //   //   //   // console.log("z.length: "+z.length);
      //   //   //   noOfPostTopicsAdded -= returnNumberOfChecked(z);
      //   //   // }
      //   //   // return;
      //   // }
      // }




      // if (document.getElementById("sequencer_checkbox").checked) {
      //   if (((initial_selected_topic_ids_pre && (initial_selected_topic_ids_pre.length + noOfPreTopicsAdded) > 1) || (noOfPreTopicsAdded > 1)) || ((initial_selected_topic_ids_post && (initial_selected_topic_ids_post.length + noOfPostTopicsAdded) > 1) || (noOfPostTopicsAdded > 1))) {
      //     document.getElementById("sequencer_checkbox").checked = false;
      //     alert("Sequencer is not valid for your current selection of topics. Turning sequencer off.");
      //     if (document.getElementById("pre").checked) {
      //       // console.log("z.length: "+z.length);
      //       noOfPreTopicsAdded -= returnNumberOfChecked(z);
      //     } else if (document.getElementById("post").checked) {
      //       // console.log("z.length: "+z.length);
      //       noOfPostTopicsAdded -= returnNumberOfChecked(z);
      //     }
      //     return;
      //   }
      // }
      // for(var elem of selected_topics_pre){
      //     var l, x, l2;
      //     l = document.getElementById("prereq-list");
      //     l2 = document.getElementById("postreq-list");
      //     x = document.createElement("DIV");
      //     x.setAttribute("class", "chip");
      //     x.setAttribute("id", elem);
      //     x.setAttribute("padding", "100px");
      //     x.innerHTML = elem;

      //     var clb = document.createElement("SPAN");
      //     clb.setAttribute("class", "closebtn");
      //     clb.setAttribute("id", elem + "-button");

      //     clb.innerHTML = '&times;';
      //     console.log(clb);


      //     x.appendChild(clb);
      //     pre.push(elem);
      //       l.innerHTML += '&nbsp;';
      //       l.appendChild(x);
      // }

      // for(var elem of selected_topics_post){
      //     var l, x, l2;
      //     l = document.getElementById("prereq-list");
      //     l2 = document.getElementById("postreq-list");
      //     x = document.createElement("DIV");
      //     x.setAttribute("class", "chip");
      //     x.setAttribute("id", elem);
      //     x.setAttribute("padding", "100px");
      //     x.innerHTML = elem;

      //     var clb = document.createElement("SPAN");
      //     clb.setAttribute("class", "closebtn");
      //     clb.setAttribute("id", elem + "-button");

      //     clb.innerHTML = '&times;';
      //     console.log(clb);


      //     x.appendChild(clb);
      //     post.push(elem);
      //       l.innerHTML += '&nbsp;';
      //       l.appendChild(x);
      // }








      for (var i = 0; i < z.length; i++) {
        var ch_id = 'check' + z[i].id;
        var prereq = z[i].id;
        var flagv = document.getElementById(ch_id).checked;
        if (flagv == true) {
          var l, x, l2;
          l = document.getElementById("prereq-list");
          l2 = document.getElementById("postreq-list");
          x = document.createElement("DIV");
        //  x.setAttribute("class", "chip");
          x.setAttribute("id", prereq);
          x.setAttribute("padding", "100px");
          x.innerHTML = prereq;

          var clb = document.createElement("SPAN");
          clb.setAttribute("class", "closebtn");
          clb.setAttribute("id", prereq + "-button");

          clb.innerHTML = '&times;';
          console.log(clb);


          x.appendChild(clb);



          if (document.getElementById("pre").checked && !selected_topics_post.has(prereq)) {
            selected_topics_pre.add(prereq);
            selected_topic_ids_pre.add(reverse_map[prereq]);
            pre.push(prereq);
            l.innerHTML += '&nbsp;';
            l.appendChild(x);
          } else if (document.getElementById("pre").checked && selected_topics_post.has(prereq)) {
            alert(prereq + ":Topic already present as a Post-Requisite!");
          } else if (document.getElementById("post").checked && !selected_topics_pre.has(prereq)) {
            selected_topics_post.add(prereq);
            selected_topic_ids_post.add(reverse_map[prereq]);
            post.push(prereq);
            l2.innerHTML += '&nbsp;';
            l2.appendChild(x);
          } else if (document.getElementById("post").checked && selected_topics_pre.has(prereq)) {
            alert(prereq + ":Topic already present as a Pre-Requisite!")
          }
        }
      }

      var plist = document.getElementsByClassName("closebtn");

      // console.log(plist[0]);
      for (var j = 0; j < plist.length; j++) {
        plist[j].addEventListener("click", function(e) {
          console.log("Called in custom-public-button.js.es6");
          // body...
          var idn = e.target.parentNode.id;
          console.log(idn);
          document.getElementById(idn).remove();
          if (document.getElementById("pre").checked) {
            noOfPreTopicsAdded -= 1;
            selected_topics_pre.delete(idn);
            selected_topic_ids_pre.delete(reverse_map[idn]);
            if (!arr.includes(idn)) {
              arr.push(idn);
            }
          } else if (document.getElementById("post").checked) {
            noOfPostTopicsAdded -= 1;
            selected_topics_post.delete(idn);
            selected_topic_ids_post.delete(reverse_map[idn]);
            if (!arr.includes(idn)) {
              arr.push(idn);
            }
          }
        });
      }



      var br = document.createElement('br');
      document.getElementById("myInput").value = '';
      closeAllLists();

      console.log(selected_topic_ids_post + "  " + selected_topic_ids_pre);

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

    },

    autocomplete() {

      if (document.getElementById("sequencer_checkbox").checked && document.getElementById("pre").checked) {
        if (((initial_selected_topic_ids_pre && (initial_selected_topic_ids_pre.length + noOfPreTopicsAdded) >= 1) || (noOfPreTopicsAdded >= 1)))
          document.getElementById("myInput").disabled = true;
        else
          document.getElementById("myInput").disabled = false;
      }

      if (document.getElementById("sequencer_checkbox").checked && document.getElementById("post").checked) {
        if (((initial_selected_topic_ids_post && (initial_selected_topic_ids_post.length + noOfPostTopicsAdded) >= 1) || (noOfPostTopicsAdded >= 1)))
          document.getElementById("myInput").disabled = true;
        else
          document.getElementById("myInput").disabled = false;
      }

      // if (initial_selected_topic_ids_pre) {
      //   for (var elem of initial_selected_topic_ids_pre) {
      //     console.log(elem);
      //     selected_topic_ids_pre.add(parseInt(elem));
      //     selected_topics_pre.add(arr_mapping[parseInt(elem)]);
      //   }
      // }

      // if (initial_selected_topic_ids_post) {
      //   for (var elem of initial_selected_topic_ids_post) {
      //     console.log(elem);
      //     selected_topic_ids_post.add(parseInt(elem));
      //     selected_topics_post.add(arr_mapping[parseInt(elem)]);
      //   }
      // }

      var inp = document.getElementById("myInput");
      var currentFocus;
      /*execute a function when someone writes in the text field:*/
      inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/


        var flag = false;
        document.getElementById("flag").value = "false";

        var x;


        var selected_topics = new Set();

        /*if(document.getElementById("pre").checked)
          selected_topics = selected_topics_pre;

        else if(document.getElementById("post").checked)
          selected_topics = selected_topics_post;*/
        for (var elem of selected_topics_pre)
          selected_topics.add(elem);

        for (var elem of selected_topics_post)
          selected_topics.add(elem);
        console.log(selected_topics);
        if (selected_topics) {
          for (var elem of selected_topics) {
            var index = arr.indexOf(elem);
            if (index != -1) {
              arr.splice(index, 1);
            }
          }
        }

        console.log(Date.now() + " " + arr + " " + arr.length);

        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            b.setAttribute("id", arr[i]);
            b.setAttribute("align", "left");
            flag = true;

            var pos = arr[i].toUpperCase().indexOf(val.toUpperCase());

            b.innerHTML = "<input id='check" + arr[i] + "' type='checkbox' value='" + arr[i] + "'>";
            b.innerHTML += '&nbsp;';
            b.innerHTML += arr[i].substr(0, pos);

            b.innerHTML += "<strong>" + arr[i].substr(pos, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(pos + val.length);
            /*insert a input field that will hold the current array item's value:*/

            /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              document.getElementById("flag").value = "true";
            });
            a.appendChild(b);
          }
        }

        if (!flag) {
          var notfound = document.createElement("DIV");
          notfound.setAttribute("align", "left");
          notfound.innerHTML = "Not Found...";
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
      document.addEventListener("click", function(e) {
        // closeAllLists(e.target);
      });
    }


  }
};
