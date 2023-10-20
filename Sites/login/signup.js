container=document.getElementsByClassName("conatainer")[0]
formInput=document.getElementById("formInput")
role=document.getElementById("role")
msg=document.getElementsByClassName("serverReturn")[0]

function load(){
    console.log(role.value)
    if (role.value === "user")
    {
        formInput.innerHTML=`<form class="form-horizontal">
        <div class="form-group">
            <label class="control-label col-sm-2" for="name">Name:</label>
            <div class="col-sm-10">
                <input required type="text" class="form-control input-color:#ffaa5e" id="name" name="name" placeholder="Enter name">
            </div>
        </div>

        <form class="form-horizontal">
            <div class="form-group">
                <label class="control-label col-sm-2" for="email">Last name:</label>
                <div class="col-sm-10">
                    <input required type="text" class="form-control input-color:#ffaa5e" id="surname" name="surname" placeholder="Enter last name">
                </div>
            </div>
`
    }
    if (role.value === "company")
    {
        formInput.innerHTML=`<form class="form-horizontal">
        <div class="form-group">
            <label class="control-label col-sm-2" for="name">Name:</label>
            <div class="col-sm-10">
                <input required type="text" class="form-control input-color:#ffaa5e" id="name" name="name" placeholder="Enter name">
            </div>
        </div>

        <form class="form-horizontal">
            <div class="form-group">
                <label class="control-label col-sm-2" for="email">Description:</label>
                <div class="col-sm-10">
                    <textarea class="form-control input-color:#ffaa5e" id="description" name="description" placeholder="Enter description"></textarea>
                </div>
            </div>
`
    }
}
var datasend=""
load()

function signin()
{
    event.preventDefault()
    pass=document.getElementById("password")
    verpass=document.getElementById("verifypassword")

    var cansend=true
    datasend="{"
    if (role.value === "company")
    {
            
            desc=document.getElementById("description")
            
            datasend+=`"${desc.id}" : "${desc.value}",\n`

            for (let i = 0; i<3;i++)
        {
            inputData=document.getElementsByTagName("input")[i]
            if(inputData.value=="")
            {cansend=false;}
            if (i<2)
            datasend +=`"${inputData.id}" : "${inputData.value}",\n`
            else
            datasend +=`"${inputData.id}" : "${inputData.value}"}`
        } 
    }

    else{
        for (let i = 0; i<4;i++)
        {
            inputData=document.getElementsByTagName("input")[i]
            if (i<3)
            datasend +=`"${inputData.id}" : "${inputData.value}",\n`
            else
            datasend +=`"${inputData.id}" : "${inputData.value}"}`
        }
    }
    console.log(datasend)
    if (pass.value!=verpass.value)
    {
        // document.documentElement.requestFullscreen()
        // window.location.href = "https://fakeupdate.net/win10ue/"
        msg.innerHTML="<p>Your passwords do not match</p>"
    }

    else
    {
        fetch(`http://localhost:8080/${role.value}/register`,{
            method:"POST",
            body: datasend,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            
        })
        .then(function(response){

            if (response.ok) { 
                window.location.href="../user/index.html"
                return response.text();
            } else {
                msg.innerHTML=`<p>${response.message}</p>`
            }
        })
        .then(function(data){
        // spInput.innerHTML=data;
        })
        
    }

}