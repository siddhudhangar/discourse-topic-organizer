import { withPluginApi } from 'discourse/lib/plugin-api';
import showModal from "discourse/lib/show-modal";

var initial_selected_topic_ids_pre = new Set();
var initial_selected_topics_pre = new Set();
var initial_selected_topic_ids_post = new Set();
var initial_selected_topics_post = new Set();

var init_pre = [];
var init_post = [];

var init_arr = [];
var arr_mapping = {};
var current_topic_id;
var reverse_map = {};
var url_map = {};
export default {
  name: 'tl-post-lock',
  initialize(container) {
    withPluginApi('0.8.24', function(api) {
      console.log("initialize has been called!");
      const hostname = window.location.href.split('/');
      const user = api.getCurrentUser();
      arr_mapping = {};
      init_arr = []; // clears array for a fresh reuse of the plugin

      var j;
      let url = hostname[0] + '//' + hostname[2] + '/latest.json';

      fetch(url)
        .then(function(response) {
          return response.json();
        })
        .then(function(json) {
          var temp = json['topic_list']['topics'];
          for (j = 0; j < temp.length; j++) {
            arr_mapping[temp[j].id] = temp[j].title;
            reverse_map[temp[j].title] = temp[j].id;
            url_map[temp[j].id] = temp[j].slug;
            init_arr.push(temp[j].title);
          }
        })
        .catch(console.error);

      if (user.trust_level >= api.container.lookup('site-settings:main').topic_organizer_tl_lock_minimum) {
        // User is allowed to see the button

        api.decorateWidget('topic-admin-menu:adminMenuButtons', (decorator) => {
          // Adds the button to the admin menu
          return {
            icon: 'tasks',
            fullLabel: 'tl_post_lock.button_label',
            action: 'actionTlLock'
          }
        });

        api.attachWidgetAction('topic-admin-menu', 'actionTlLock', () => {
          // disable background scrolling when popup form is open
          $(document.documentElement).css('overflow', 'hidden');

          var current_topic_url = window.location.href;
          current_topic_id = parseInt(current_topic_url.split('/')[5]);
          const store = container.lookup("store:main");
          store.findAll('note')
            .then(result => {
              for (const note of result.content) {
                if (parseInt(note["id"]) == current_topic_id) {
                  initial_selected_topic_ids_pre = note["prior_topic_id"];
                  //initial_selected_topics_pre = arr_mapping[note["prior_topic_id"]];
                  initial_selected_topic_ids_post = note["next_topic_id"];
                  //initial_selected_topics_post = arr_mapping[note["next_topic_id"]];
                  if (initial_selected_topic_ids_pre) {
                    var temp = Array.from(initial_selected_topic_ids_pre);
                    var k;
                    for (k = 0; k < note["prior_topic_id"].length; k++) {
                      initial_selected_topics_pre.add(arr_mapping[parseInt(note["prior_topic_id"][k])]);

                      // This is code to display initial selected pre topics as chips in the popup form
                      // var elem = arr_mapping[parseInt(note["prior_topic_id"][k])];
                      // console.log(elem);
                      // var l, x, l2;
                      // l = document.getElementById("prereq-list");
                      // console.log("this is l: " + l);
                      // l2 = document.getElementById("postreq-list");
                      // x = document.createElement("DIV");
                      // x.setAttribute("class", "chip");
                      // x.setAttribute("id", elem);
                      // x.setAttribute("padding", "100px");
                      // x.innerHTML = elem;

                      // var clb = document.createElement("SPAN");
                      // clb.setAttribute("class", "closebtn");
                      // clb.setAttribute("id", elem + "-button");

                      // clb.innerHTML = '&times;';
                      // console.log(clb);


                      // x.appendChild(clb);
                      // init_pre.push(elem);
                      // l.innerHTML += '&nbsp;';
                      // l.appendChild(x);
                    }
                  }

                  if (initial_selected_topic_ids_post) {
                    var temp = Array.from(initial_selected_topic_ids_post);
                    for (k = 0; k < note["next_topic_id"].length; k++) {
                      initial_selected_topics_post.add(arr_mapping[parseInt(note["next_topic_id"][k])]);

                      // This is code to display initial selected post topics as chips in the popup form
                      // var elem = arr_mapping[parseInt(note["next_topic_id"][k])];
                      // var l, x, l2;
                      // l = document.getElementById("prereq-list");
                      // l2 = document.getElementById("postreq-list");
                      // x = document.createElement("DIV");
                      // x.setAttribute("class", "chip");
                      // x.setAttribute("id", elem);
                      // x.setAttribute("padding", "100px");
                      // x.innerHTML = elem;

                      // var clb = document.createElement("SPAN");
                      // clb.setAttribute("class", "closebtn");
                      // clb.setAttribute("id", elem + "-button");

                      // clb.innerHTML = '&times;';
                      // console.log(clb);


                      // x.appendChild(clb);
                      // init_post.push(elem);
                      // l2.innerHTML += '&nbsp;';
                      // l2.appendChild(x);
                    }
                  }
                }
              }

              // Start
              // var plist = document.getElementsByClassName("closebtn");
              // initial_selected_topic_ids_pre = new Set(initial_selected_topic_ids_pre);
              // initial_selected_topic_ids_post = new Set(initial_selected_topic_ids_post);

              // console.log("plist.length: " + plist.length);

              // console.log(plist[0]);
              // for (var j = 0; j < plist.length; j++) {
              //   plist[j].addEventListener("click", function(e) {
              //     console.log("Called in admin_button.js.es6");
              //     // body...
              //     var idn = e.target.parentNode.id;
              //     console.log(idn);
              //     console.log("parentid="+idn);
              //     document.getElementById(idn).remove();
              //     if (document.getElementById("pre").checked) {
              //       // noOfPreTopicsAdded -= 1;
              //       initial_selected_topics_pre.delete(idn);
              //       console.log(initial_selected_topics_pre);
              //       // console.log(Array.isArray(initial_selected_topic_ids_pre));
              //       initial_selected_topic_ids_pre.delete(reverse_map[idn]);
              //       // if (!arr.includes(idn)) {
              //       //   arr.push(idn);
              //       // }
              //     } else if (document.getElementById("post").checked) {
              //       // noOfPostTopicsAdded -= 1;
              //       initial_selected_topics_post.delete(idn);
              //       initial_selected_topic_ids_post.delete(reverse_map[idn]);
              //       // if (!arr.includes(idn)) {
              //       //   arr.push(idn);
              //       // }
              //     }
              //   });
              // }
              // End

            })
            .catch(console.error);

          // var plist = document.getElementsByClassName("closebtn");

          // console.log("plist.length: "+plist.length);

          // // console.log(plist[0]);
          // for (var j = 0; j < plist.length; j++) {
          //   plist[j].addEventListener("click", function(e) {
          //     // body...
          //     var idn = e.target.parentNode.id;
          //     console.log(idn);
          //     document.getElementById(idn).remove();
          //     if (document.getElementById("pre").checked) {
          //       // noOfPreTopicsAdded -= 1;
          //       initial_selected_topics_pre.delete(idn);
          //       initial_selected_topic_ids_pre.delete(reverse_map[idn]);
          //       // if (!arr.includes(idn)) {
          //       //   arr.push(idn);
          //       // }
          //     } else if (document.getElementById("post").checked) {
          //       // noOfPostTopicsAdded -= 1;
          //       initial_selected_topics_post.delete(idn);
          //       initial_selected_topic_ids_post.delete(reverse_map[idn]);
          //       // if (!arr.includes(idn)) {
          //       //   arr.push(idn);
          //       // }
          //     }
          //   });
          // }


          if (init_arr.indexOf(arr_mapping[current_topic_id]) != -1)
            init_arr.splice(init_arr.indexOf(arr_mapping[current_topic_id]), 1);

          document.getElementById("myForm").style.display = "block";
          document.getElementById("myInput").disabled = false;
          document.getElementById("addt").style.display = "none";

          // $('body').css('overflow-y', 'hidden');

          console.log("initial_selected_topics_pre.size: " + initial_selected_topics_pre.size);

        });

      }
    });
  }
};

export {
  arr_mapping,
  init_arr,
  current_topic_id,
  reverse_map,
  url_map,
  initial_selected_topic_ids_post,
  initial_selected_topics_post,
  initial_selected_topic_ids_pre,
  initial_selected_topics_pre,
  init_pre,
  init_post
};
