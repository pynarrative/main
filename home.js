$(document).ready(function(){
    var template_gallery = $("#template_gallery");

    let templates = [
        "colosseumTemplate",
        "tourEiffelTemplate",
        "darkBlueTemplate",
        "darkRedTemplate",
        "orangeBlueTemplate",
        "militaryTemplate"
    ]


    for (let i=0; i<=5; i++){
        let template_name = templates[i];
        let main_image_path = `img/template/${template_name}/${template_name}A.png`;
        let second_image_path = `img/template/${template_name}/${template_name}B.png`;
        let template_file = `img/template/${template_name}/${template_name}.py`;
        let template_img = $(`
                <div class = "template">
                    <img class = "main" src = "${main_image_path}">
                    <img class = "second" src = "${second_image_path}">
                    <a href = "${template_file}"></a>
                    <p class = "click_to_download">Click to download ${template_name}.py</p>
                </div>
            `);
        template_gallery.append(template_img);
    }

    $(".template").on("mouseenter", function (){
        let main_img = $(this).find("img.main");
        let second_img = $(this).find("img.second");
        let click_to_download = $(this).find(".click_to_download");
        
        main_img.css("display", "none");
        second_img.css("display", "block");

        let timer = setTimeout(() => {
            click_to_download.css("opacity", "1");
        }, 750);

        $(this).data("hoverTimer", timer);

    }).on("mouseleave", function (){
        clearTimeout($(this).data("hoverTimer"));
        $(this).find("img.main").css("display", "block");
        $(this).find("img.second").css("display", "none");
        $(this).find(".click_to_download").css("opacity", "0");
    });

    $(".template").on("click", function(){
        let click_to_download = $(this).find(".click_to_download");
        if ((click_to_download).css("opacity") == "1"){
            let template = $(this).find("a").attr("href");
                let download_template = $("<a>")
                    .attr("href", template)
                    .attr("download", "")
                    .appendTo("body");

                download_template[0].click();

                download_template.remove();

                setTimeout(() => {
                    window.scrollTo(0, $("#instructions").offset().top);
                }, 1000)
            }

    });

    
    $(window).on("scroll", function (){
        if ($(window).scrollTop() > 500) {
            $("#arrow_up").css("opacity", "1");
        } else {
            $("#arrow_up").css("opacity", "0");
        }
    });

});