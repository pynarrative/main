$(document).ready(function(){
    var template_gallery = $("#template_gallery");


    for (let i=1; i<=5; i++){
        main_image_path = "img/template_img/template"+i+".svg";
        second_image_path = "img/template_img/template"+i+"_1.svg";
        var template_img = $("<div class='template'><img class='main' src = '"+main_image_path+"'> <img class='second' src = '"+second_image_path+"'> </div>");
        template_gallery.append(template_img);
    }

    $(".template").on("mouseenter", function (){
        $(this).find("img.main").css("display", "none");
        $(this).find("img.second").css("display", "block");
    }).on("mouseleave", function (){
        $(this).find("img.main").css("display", "block");
        $(this).find("img.second").css("display", "none");
    });
    
    
    
    $(window).on("scroll", function (){
        if ($(window).scrollTop() > 500) {
            $("#arrow_up").css("opacity", "1");
        } else {
            $("#arrow_up").css("opacity", "0");
        }
    });

});