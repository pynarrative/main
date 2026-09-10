$(document).ready(function(){
    var template_gallery = $("#template_gallery");

    let templates = [
        "colosseumTemplate",
        "tourEiffelTemplate",
        "darkBlueTemplate",
        "inflationTemplate",
        "orangeBlueTemplate",
        "militaryTemplate",
        "sampleTemplate",
        "greenTemplate"
    ]

    for (let i=0; i<=7; i++){
        let template_name = templates[i];
        let main_image_path = `img/template/${template_name}/${template_name}A.png`;
        let second_image_path = `img/template/${template_name}/${template_name}B.png`;
        let template_file = `img/template/${template_name}/${template_name}.py`;
        let notebook_file = `img/template/${template_name}/${template_name}.ipynb`;
        let template_img = $(`
                <div class = "template">
                    <img class = "main" src = "${main_image_path}">
                    <img class = "second" src = "${second_image_path}">
                    <a class = "template_file" href = "${template_file}"></a>
                    <a class = "notebook_file" href = "${notebook_file}"></a>
                    <p class = "click_to_preview">Click to preview ${template_name}.py</p>
                </div>
            `);
        template_gallery.append(template_img);
    }

    $(".template").on("mouseenter", function (){
        let main_img = $(this).find("img.main");
        let second_img = $(this).find("img.second");
        let click_to_preview = $(this).find(".click_to_preview");
        
        main_img.css("display", "none");
        second_img.css("display", "block");

        let timer = setTimeout(() => {
            click_to_preview.css("opacity", "1");
        }, 750);

        $(this).data("hoverTimer", timer);

    }).on("mouseleave", function (){
        clearTimeout($(this).data("hoverTimer"));
        $(this).find("img.main").css("display", "block");
        $(this).find("img.second").css("display", "none");
        $(this).find(".click_to_preview").css("opacity", "0");
    });

    $(".template").on("click", function(){
        let click_to_preview = $(this).find(".click_to_preview");
        let main_img = $(this).find(".main").attr("src");
        let sec_img = $(this).find(".second").attr("src");
        let template_path = $(this).find("a.template_file").attr("href");
        let notebook_path = $(this).find("a.notebook_file").attr("href");
        let template_name = template_path.split("/").pop();

        if ((click_to_preview).css("opacity") == "1"){
            
            $("#big_template_preview img.main_image").attr("src", main_img);
            $("#big_template_preview img.secondary_image").attr("src", sec_img);
            $("#download_template_button span").html(template_name);
            $("#download_template_button a").attr("href", template_path);
            $("#download_notebook_button a").attr("href", notebook_path);
            window.scrollTo(0, $("#big_template_preview").offset().top);
        }
    });

    function slideshow(){
        let container = $("#big_template_preview");
        let main_img = container.find("img.main_image");
        let secondary_img = container.find("img.secondary_image");
        let timer = null;
        
        let i = 0;
        function next_slide(){
            main_img.fadeOut(400, function(){
                i = (i+1) % templates.length;
                let template_name = templates[i];
                let main_image_path = `img/template/${template_name}/${template_name}A.png`;
                let secondary_image_path = `img/template/${template_name}/${template_name}B.png`;
                let template_file = `img/template/${template_name}/${template_name}.py`;
                let example_notebook = `img/template/${template_name}/${template_name}.ipynb`;

                secondary_img.attr("src", secondary_image_path);
                main_img.attr("src", main_image_path).fadeIn(400);
                $("#download_template_button span").html(template_name+".py");
                $("#download_template_button a").attr("href", template_file)
                $("#download_notebook_button a").attr("href", example_notebook)
            });
        };

        function start() {
            if (!timer) {
                timer = setInterval(next_slide, 5000);
            }
        }
        function stop() {
            clearInterval(timer);
            timer = null;
        }
        container.hover(
            function() { stop(); },  // MouseEnter: Pausa
            function() { start(); }  // MouseLeave: Riprende
        );

        start();
    }
    slideshow();

    $("#big_template_preview").on("mouseenter", function (){
        let main_img = $(this).find("img.main_image");
        let second_img = $(this).find("img.secondary_image");
        
        main_img.css("display", "none");
        second_img.css("display", "block");

    }).on("mouseleave", function (){
        $(this).find("img.main_image").css("display", "block");
        $(this).find("img.secondary_image").css("display", "none");
    });

    $("#download_template_button").on("click", function(){
        let template = $(this).find("a").attr("href");
                let download_template = $("<a>")
                    .attr("href", template)
                    .attr("download", "")
                    .appendTo("body");

                download_template[0].click();

                download_template.remove();
    });

    $("#download_notebook_button").on("click", function(){
    let notebook = $(this).find("a").attr("href");
            let notebook_template = $("<a>")
                .attr("href", notebook)
                .attr("download", "")
                .appendTo("body");

            notebook_template[0].click();

            notebook_template.remove();
    });


    
    $(window).on("scroll", function (){
        if ($(window).scrollTop() > 500) {
            $("#arrow_up").css("opacity", "1");
        } else {
            $("#arrow_up").css("opacity", "0");
        }
    });

});