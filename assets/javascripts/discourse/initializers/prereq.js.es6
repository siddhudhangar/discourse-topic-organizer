import { withPluginApi } from 'discourse/lib/plugin-api';
import { h } from 'virtual-dom';

import { popupAjaxError } from 'discourse/lib/ajax-error';
import Topic from 'discourse/models/topic';
import { ajax } from 'discourse/lib/ajax';

var arr = [];
var arr_mapping = {};
var current_topic_id;
var reverse_map = {};
var url_map = new Map();
const settings = Discourse.SiteSettings;
export default {
  name: 'myprereq',
  initialize(container) {
    withPluginApi('0.8.24', function(api) {
      api.decorateWidget('post-stream:before', helper => {
        //arr = [];
        var current_topic_url, current_topic_id;
        current_topic_url = window.location.href;

        current_topic_id = parseInt(current_topic_url.split('/')[5]);

        const hostname = window.location.href.split('/');

        var j;
        var check_success = false;
        //let url = hostname[0] + '//' + hostname[2] + '/latest.json'
        //let url = hostname[0] + '//' + hostname[2] + '/categories.json';
        let url = hostname[0] + '//' + hostname[2] + '/topic/get_all_cat.json';
        ajax(url)
          //.then(result)
          .then(result => {
            //var response_of_categories = result['category_list']['categories'];
            //var i;
            //for( i = 0; i < response_of_categories.length; i++ ){
            //var category_url = hostname[0] + '//' + hostname[2] +'/c/' + response_of_categories[i]['slug'] + //'.json'
            //ajax(category_url)
            // .then(function(result) {
            //  return result;
            //})
            //.then(function(json) {
            //var temp = json['topic_list']['topics'];

            var temp = result['topics'];
            //console.log("tempppp");
            //console.log(temp);
            for (j = 0; j < temp.length; j++) {
              arr_mapping[temp[j].id] = temp[j].title;
              reverse_map[temp[j].title] = temp[j].id;
              url_map.set(temp[j].id, temp[j].slug);
              arr.push(temp[j].title);
            }
            //});
            //}
            
            $("#prereq_list").empty();
            //if (i == response_of_categories.length){
            ajax('/topic/retrieve_previous', {
              type: 'GET',
              data: {
                topic_id: parseInt(current_topic_id)
              },
              //async: false
            }).then(result => {
              var prior_ids = result.row_value.split(",");
              //console.log(prior_ids);
              if(prior_ids) {
                $("#prereq_list").append("Previous Topic/s"+"&nbsp;&nbsp;");
                for (var k = 0; k < prior_ids.length; k++) {
                  var idp = parseInt(prior_ids[k]);
                  var ref = url_map.get(idp);
                  var lname = arr_mapping[idp];
                  var text = '<a class="btn previous_next_button btn-warning btn-xs"';
                  text += 'href="' + hostname[0] + '//' + hostname[2] + '/t/';
                  text += ref;
                  text += '/';
                  text += idp;
                  text += '">';
                  // if (note["sequence_on"] == "true")
                  //   text += 'Prev';
                  // else
                    text += lname;
                  text += '</a>&nbsp;';
                  $("#prereq_list").append(text);
                  //console.log(text);
                }
              }
            }).catch(console.error);
            //}
            // const store = container.lookup("store:main");
            // store.findAll('note')
            //   .then(result => {
            //     for (const note of result.content) {
            //       if (parseInt(note["id"]) == current_topic_id) {
            //         var prior_ids = note["prior_topic_id"];
            //         if (prior_ids) {
            //           for (var k = 0; k < prior_ids.length; k++) {
            //             var idp = parseInt(prior_ids[k]);
            //             var ref = url_map.get(idp);
            //             var lname = arr_mapping[idp];
            //             var text = '<a class="btn btn-warning btn-xs"';
            //             text += 'href="' + hostname[0] + '//' + hostname[2] + '/t/';
            //             text += ref;
            //             text += '/';
            //             text += idp;
            //             text += '">';
            //             if (note["sequence_on"] == "true")
            //               text += 'Prev';
            //             else
            //               text += lname;
            //             text += '</a>&nbsp;';
            //             //console.log(text);
            //             $("#prereq_list").append(text);
            //           }
            //         }
            //       }
            //     }
            //   })
            //   .catch(console.error);

          });

      });

      //postreqs here............................

      api.decorateWidget('post-stream:after', helper => {
        //arr=[];

        var current_topic_url, current_topic_id;
        current_topic_url = window.location.href;

        current_topic_id = parseInt(current_topic_url.split('/')[5]);
        //	console.log("topic="+current_topic_id+" "+current_topic_url);

        const hostname = window.location.href.split('/');

        var j;

        //let url = hostname[0] + '//' + hostname[2] + '/latest.json'
        //let url = hostname[0] + '//' + hostname[2] + '/categories.json';
        let url = hostname[0] + '//' + hostname[2] + '/topic/get_all_cat.json';
        ajax(url)
          //.then(response => response.json())
          .then(result => {
            //var response_of_categories = result['category_list']['categories'];
            //for(var i = 0; i < response_of_categories.length; i++ ){
            //var category_url = hostname[0] + '//' + hostname[2] +'/c/' + response_of_categories[i]['slug'] + //'.json'
            //ajax(category_url)
            // .then(function(result) {
            //  return result;
            //})
            //.then(function(json) {
            //var temp = json['topic_list']['topics'];
            var temp = result['topics'];

            for (j = 0; j < temp.length; j++) {
              arr_mapping[temp[j].id] = temp[j].title;
              reverse_map[temp[j].title] = temp[j].id;
              url_map.set(temp[j].id, temp[j].slug);
              arr.push(temp[j].title);
            }
            //});
            //}

            $("#postreq_list").empty();
            //if (i == response_of_categories.length){
            ajax('/topic/retrieve_next', {
              type: 'GET',
              data: {
                topic_id: parseInt(current_topic_id)
              },
            }).then(result => {
              var next_ids = result.row_value.split(",");

              if(next_ids) {
                $("#postreq_list").append("Next Topic/s"+"&nbsp;&nbsp;");
                for (var k = 0; k < next_ids.length; k++) {
                  var idp = parseInt(next_ids[k]);
                  var ref = url_map.get(idp);
                  var lname = arr_mapping[idp];
                  var text = '<a class="btn previous_next_button btn-warning btn-xs"';
                  text += 'href="' + hostname[0] + '//' + hostname[2] + '/t/';
                  text += ref;
                  text += '/';
                  text += idp;
                  text += '">';
                  // if (note["sequence_on"] == "true")
                  //   text += 'Prev';
                  // else
                    text += lname;
                  text += '</a>&nbsp;';

                  $("#postreq_list").append(text);
                }
              }
            }).catch(console.error);
            
          //}
          }); // fetch function's inside block closed
      });
    });

  }
};
