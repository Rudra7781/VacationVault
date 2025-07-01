function toggleLike(user, ele) {
    const body = {
        userId: JSON.parse(user)._id,
        vaultId: ele.id
    };
    $.post("/like/add", body, function(data, status, xhr) {
        // Handle the response
        if (status === "success") {
            if(ele.classList.contains("red")){
                ele.classList.remove("red");
            }else{
                ele.classList.add("red");
            }
            location.reload();

        } else {
            console.error("Error occurred while processing the like", xhr.responseText);
        }
    }).fail(function(xhr, status, error) {
        // Handle any errors here
        alert(JSON.parse(xhr.responseText).message);
    });
}