export default {
  actions: {
    clickButton() {
      //const url = this.siteSettings.topic_group_button_url.replace('<TOPIC_ID>', this.get('topic.id')).replace('<USER_ID>', this.currentUser.id).replace('<USERNAME>', this.currentUser.username);
      //window.open(url, 'popUpWindow','height=500,width=500,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');
 	document.getElementById("myForm").style.display = "block";
    },
    closeForm(){
    	document.getElementById("myForm").style.display = "none";	
    }
  }
};


