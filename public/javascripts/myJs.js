/* is a JSON object which contains specialities and their sectors(options) 
is a table that conains objects and arrays
*/
let studyDomain = [
{"specialty":"civil engineering","sector":["construction and public works","hydraulic structure"]},
{"specialty":"mechanical Engineering","sector":["construction and building services","aerospace and automotive industries"]},
{"specialty":"Industrial Engineering","sector":["operations research and optimization techniques","supply chain management and logistics"]},
{"specialty":"Computer Engineering","sector":["information system and software engineering","security of information systems"]}
];

var studentsArray = []; 

var selectedindex = -1;

var LS = false;

// function allows to load data to sector selector depending on specialty selected by the user
function SelectSectors(specialtySelected) {
                var htmlSector = '';
                for (var i = 0; i < studyDomain.length; i++) {
                 if(studyDomain[i].specialty == specialtySelected){
                    for (var j = 0; j < studyDomain[i].sector.length; j++) {
                        htmlSector+='<option value="'+studyDomain[i].sector[j]+'">'+studyDomain[i].sector[j]+'</option>'; 
                        }
                         $('#sector').html(htmlSector); 
                    }
                    }
}


// function that will be called by body to load data from JSON object(studyDomain) to specialty and sector html parts
function inite() {

                var htmlSpecialty = '';
                for (var i = 0; i < studyDomain.length; i++) {
                  htmlSpecialty+='<option value="'+studyDomain[i].specialty+'">'+studyDomain[i].specialty+'</option>';
                }
                $('#specialty').html(htmlSpecialty);
                $('#specialty').val('Computer Engineering');
                SelectSectors("Computer Engineering");
                // call RefreshTable 
                RefreshTable();
}

// fill the table from localStrorage.studentInfo (information of students)
function RefreshTable() {
 document.getElementById("tablerows").innerHTML=" ";
   if (localStorage.studentsInfo) {
                    studentsArray = JSON.parse(localStorage.studentsInfo);
                    for (var i = 0; i < studentsArray.length; i++) {
                        prepareTableCell(i,studentsArray[i].firstname, studentsArray[i].lastname, studentsArray[i].cin, studentsArray[i].email, studentsArray[i].specialty, studentsArray[i].sector);
                    }
                }
}

//reset the form 
function resetForm() {

                $("#firstname").val('');
                $("#lastname").val('');
                $("#cin").val('');
                $("#email").val('');
                document.getElementById("submit").innerHTML="Validate";

                //remove data from localStorage.formInfo(information that user set befor resetting or that user validated)
                localStorage.removeItem('formInfo');
                selectedindex = -1;
}

// delete student's data from Table and localStorage
function deletRow(index) {
  /*var table = document.getElementById("tableStudent");
  table.deleteRow(index+1);*/
  studentsArray.splice(index,1);
  localStorage.studentsInfo=JSON.stringify(studentsArray);
  document.getElementById("submit").innerHTML="Validate";
  RefreshTable();
}

function editeRow(index) {
                selectedindex = index;
                var studentObject = studentsArray[index];
                $("#firstname").val(studentObject.firstname);
                $("#lastname").val(studentObject.lastname);
                $("#cin").val(studentObject.cin);
                $("#email").val(studentObject.email);
                $("#specialty").val(studentObject.specialty);
                SelectSectors($("#specialty").val());
                $("#sector").val(studentObject.sector);
                document.getElementById("submit").innerHTML="Update";
                var htmlll= '';
                $("#pp").html(htmlll);
}

function prepareTableCell(index,firstName, lastName, cin, email, specialty,sector) {
                var table = document.getElementById("tablerows");
                var row = table.insertRow();

                var firstNameCell = row.insertCell(0);
                var lastNameCell = row.insertCell(1);
                var cinCell = row.insertCell(2);
                var emailCell = row.insertCell(3);
                var specialtyCell = row.insertCell(4);
                var sectorCell = row.insertCell(5);
                var actionCell = row.insertCell(6);

                firstNameCell.innerHTML = firstName;
                lastNameCell.innerHTML = lastName;
                cinCell.innerHTML = cin;
                emailCell.innerHTML = email;
                specialtyCell.innerHTML = specialty;
                sectorCell.innerHTML = sector;
                actionCell.innerHTML = '<button id="bt" onclick="editeRow('+index+')">Edit</button><br/><button id ="bt" onclick="deletRow('+index+')">Delete</button>';
            }
 //check if cin or email of the new student already exist in localStorage
function checkKey() {
  if (localStorage.studentsInfo && localStorage['formInfo']) {
  LS=JSON.parse(localStorage['formInfo']);
  for (var i = 0; i < studentsArray.length; i++) {
    if(LS["cin"] === studentsArray[i].cin || LS["email"] === studentsArray[i].email){
      console.log("already exist");
      var htmlll= '<p> Cin or Email already exist </p>';
      $("#pp").html(htmlll);
      return true;
    }
  }
 }
 return false;
}

function checkKeyWithIndex(index){
  if (localStorage.studentsInfo && localStorage['formInfo']) {
  LS=JSON.parse(localStorage['formInfo']);
  for (var i = 0; i < studentsArray.length; i++) {
    if(i != index){
    if(LS["cin"] === studentsArray[i].cin || LS["email"] === studentsArray[i].email){
      console.log("already exist");
     var htmlll= '<p> Cin or Email already exist </p>';
     $("#pp").html(htmlll);
      return true;
    }
  }
 }
 }
 return false
}

 function onAddStudent(){
                var firstName = $("#firstname").val();
                var lastName = $("#lastname").val();
                var cin = $("#cin").val();
                var email = $("#email").val();
                var specialty = $("#specialty").val();
                var sector = $("#sector").val();
                console.log("selected index"+selectedindex);
                var studentObject = {firstname: firstName, lastname: lastName, cin: cin, email: email, specialty: specialty, sector:sector};
                if(selectedindex === -1){
                  if(checkKey() === false){
                  studentsArray.push(studentObject);
                            }
                }else{

                  if(checkKeyWithIndex(selectedindex) === false){
                  studentsArray.splice(selectedindex,1,studentObject);
                }
                }

                localStorage.studentsInfo = JSON.stringify(studentsArray);

                resetForm();
                inite();
               
            }


jQuery(function($) {

   //jquery function
   $.fn.formBackup = function() {
    if(!localStorage){
      return false;
    }
     var forms = this;
     var datas = {};
     var ls = false;
     datas.href = window.location.href;

     //retrieve local storage informations
     if(localStorage['formInfo']){
        ls=JSON.parse(localStorage['formInfo']);
        if(ls.href == datas.href){
          for(var id in ls){
            if(id != 'href'){
                $('#'+id).val(ls[id]);
                datas[id] = ls[id];
            }
          }
        }
     }

     //load data to sectors selector for each change happens in specialty selector
      $("#specialty").change(function () {
        var specialtySelected = $("#specialty").val();
        SelectSectors(specialtySelected);
      });

     //save informations that user enters in localStorage
     forms.find('input').keyup(function(e){
        datas[$(this).attr('id')] = $(this).val();
        localStorage.formInfo=JSON.stringify(datas);
        var htmlll= '';
        $("#pp").html(htmlll);
     });
   }

   $('#borderBlue').formBackup();

});


