$(document).ready(function(){

    $("select#font_selection").on("input", function(){
        let selected_font = $(this).find("option:selected").val();
        $(this).css("font-family", selected_font);
        $(".color_preview").css("font-family", selected_font);
    });


    function check_contrast(background, foreground, contrast_element) {
        function hexToRgb(color) {
            color = color.replace("#", "");

            if (color.length === 3) {
                color = color
                    .split("")
                    .map(char => char + char)
                    .join("");
            }

            return {
                r: parseInt(color.substring(0, 2), 16),
                g: parseInt(color.substring(2, 4), 16),
                b: parseInt(color.substring(4, 6), 16)
            };
        }

        function luminance(color) {
            let rgb = hexToRgb(color);

            let values = [rgb.r, rgb.g, rgb.b].map(value => {
                value /= 255;

                return value <= 0.03928
                    ? value / 12.92
                    : Math.pow((value + 0.055) / 1.055, 2.4);
            });

            return (
                0.2126 * values[0] +
                0.7152 * values[1] +
                0.0722 * values[2]
            );
        }

        let background_luminance = luminance(background);
        let foreground_luminance = luminance(foreground);

        let lighter = Math.max(
            background_luminance,
            foreground_luminance
        );

        let darker = Math.min(
            background_luminance,
            foreground_luminance
        );

        let contrast = (lighter + 0.05) / (darker + 0.05);
        let result = Number(contrast.toFixed(2));

        $(contrast_element).html(result + ":1");

        let contrast_box = $(contrast_element).closest(".contrast_ratio");

        contrast_box.removeClass(
            "contrast_red contrast_orange contrast_green"
        );

        if (result < 3) {
            contrast_box.addClass("contrast_red");
        } else if (result < 4.5) {
            contrast_box.addClass("contrast_orange");
        } else {
            contrast_box.addClass("contrast_green");
        }

        return result;
    }

    function update_color(color_input, color_preview, contrast_ratio) {
        let color = $(color_input).val();
        let text_color = $("#text_color_input").val();

        $(color_preview).css({
            "background-color": color,
            "color": text_color
        });

        check_contrast(
            color,
            text_color,
            contrast_ratio
        );
    }

    function update_all_contrasts() {
        let text_color = $("#text_color_input").val();

        check_contrast(
            $("#main_color_input").val(),
            text_color,
            "#main_color_contrast"
        );

        check_contrast(
            $("#tab_color_input").val(),
            text_color,
            "#tab_color_contrast"
        );

        check_contrast(
            $("#secondary_color_input").val(),
            text_color,
            "#secondary_color_contrast"
        );

        check_contrast( 
            "#ffffff",
            $("#title_color_input").val(),
            "#title_color_contrast"
        );
    }

    $("#main_color_input").on("input", function () {
        update_color(
            "#main_color_input",
            "#main_color_preview",
            "#main_color_contrast"
        );
    });

    $("#tab_color_input").on("input", function () {
        update_color(
            "#tab_color_input",
            "#tab_color_preview",
            "#tab_color_contrast"
        );
    });

    $("input.ta_border_color_input").on("input", function () {
        $("#tab_color_preview").css("border-color", $(this).val());
    });

    $("#highlight_color_input").on("input", function () {
        update_color(
            "#highlight_color_input",
            "#highlight_color_preview",
            "#highlight_color_contrast"
        );
    });

    $("#secondary_color_input").on("input", function () {
        update_color(
            "#secondary_color_input",
            "#secondary_color_preview",
            "#secondary_color_contrast"
        );
    });

    $("#title_color_input").on("input", function () {
        title_color = $(this).val();
        $("#title_color_preview").css("color", title_color)
        update_all_contrasts();
    });

    $("#text_color_input").on("input", function () {
        let text_color = $(this).val();

        $(".color_preview").css("color", text_color);

        update_all_contrasts();
    });

    $("#font_selection").on("change", function () {
        let selected_font = $(this).val();
        $(".color_preview").css("font-family", selected_font);
    });

    $("#font_size_selection").on("change", function () {
        let font_size = $(this).val();
        if (font_size > 24){
            font_size = 24;
        }
        $(".color_preview").css("font-size", font_size+"pt");
    });


    let original_tab_color = $("#tab_color_input").val();
    $("#tab_color_check").on("click", function () {
        $("#tab_color_input").toggle(100);
        let current_color = $("#tab_color_input").val();
        if (current_color == "#ffffff"){
            $("#tab_color_input").val(original_tab_color);
            $("#tab_color_preview").css("background-color", original_tab_color);
            check_contrast(original_tab_color, $("#text_color_input").val(), "#tab_color_contrast");
        } else{
            original_tab_color = current_color;
            $("#tab_color_input").val("#ffffff");
            $("#tab_color_preview").css("background-color", "#ffffff");
            check_contrast("#ffffff", $("#text_color_input").val(), "#tab_color_contrast");
        }
    });
    
    
    let original_ta_border_color = $("input[type='color'].ta_border_color_input").val();
    $("input[type='checkbox'].ta_border_color_input").on("click", function () {
        let current_color = $("#tab_color_preview").css("border-color");
        $("input[type='color'].ta_border_color_input").toggle(100);
        if (current_color == "rgba(0, 0, 0, 0)"){
            $("#tab_color_preview").css("border-color", original_ta_border_color);
        } else{
            original_ta_border_color = current_color;
            $("#tab_color_preview").css("border-color", "rgba(0, 0, 0, 0)");
        }
    });

    $("#secondary_color_check").on("click", function () {
        $("#secondary_color_input").toggle(100);
        $("#secondary_color_preview").toggle();
        $("#secondary_color_contrast").toggle();
    });

    update_color(
        "#main_color_input",
        "#main_color_preview",
        "#main_color_contrast"
    );

    update_color(
        "#tab_color_input",
        "#tab_color_preview",
        "#tab_color_contrast"
    );

    update_color(
        "#highlight_color_input",
        "#highlight_color_preview",
        "#highlight_color_contrast"
    );

    update_color(
        "#secondary_color_input",
        "#secondary_color_preview",
        "#secondary_color_contrast"
    );

    $("#text_color_input").trigger("input");
    $("#font_selection").trigger("change");
    $("#font_size_selection").trigger("change");



    $(window).on("scroll", function (){
        if ($(window).scrollTop() > 500) {
            $("#arrow_up").css("opacity", "1");
        } else {
            $("#arrow_up").css("opacity", "0");
        }
    });


    $("#create_template").on("click", function(){
        let output_box = $("#template_preview");
        output_box.html("<img src='img/icon/loading_icon.gif'/>"); //gif di caricamento

        // Font options
        function check_font_size(size, min, max, default_size){
            if (size == ""){size = default_size; console.log("Ramo isNaN" + size)};
            if (size < min){size = min};
            if (size > max){size = max};
            return Number(size)
            
        }

        let template_name = $("#template_name").val()
        if (template_name == ""){
            template_name = "myTemplate"
        }

        // Font options
        let font_family = $("#font_selection").val();
        let standard_font_size = $("#font_size_selection").val();
        standard_font_size = check_font_size(standard_font_size, 1, 30, 12);
        let title_font_size_multiplier = $("#title_font_multiplier").val();
        title_font_size_multiplier = check_font_size(title_font_size_multiplier, 0, 5, 1.6);
        let subtitle_font_size_multiplier = $("#subtitle_font_multiplier").val();
        subtitle_font_size_multiplier = check_font_size(subtitle_font_size_multiplier, 0, 5, 1.2);
        let context_font_size_multiplier = $("#context_font_multiplier").val();
        context_font_size_multiplier = check_font_size(context_font_size_multiplier, 0, 5, 1);
        let nextstep_font_size_multiplier = $("#nextstep_font_multiplier").val();
        nextstep_font_size_multiplier = check_font_size(nextstep_font_size_multiplier, 0, 5, 1);
        let source_font_size_multiplier = $("#source_font_multiplier").val();
        source_font_size_multiplier = check_font_size(source_font_size_multiplier, 0, 5, 0.9);


        // Colors
        let main_color = $("#main_color_preview").css("background-color");
        let tab_color = $("#tab_color_preview").css("background-color");
        let ta_border_color = $("#tab_color_preview").css("border-color");
        let secondary_color = $("#secondary_color_preview").css("background-color");
        let title_color = $("#title_color_input").val();
        let text_color = $("#main_color_preview").css("color");
        let highlight_color = $("#highlight_color_preview").css("background-color");

        function lighten_color(color) {
            const match = color.match(/\d+/g);
            const rgb = match.slice(0, 3).map(value => Math.min(255, parseInt(value, 10) + 50));
            return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
        }

        if ($("#secondary_color_preview").css("display") == "none"){
            secondary_color = lighten_color(main_color)
        }
        if ($("#tab_color_preview").css("display") == "none"){
            tab_color = "(255, 255, 255)"
        }

        async function main() {
        try {
            // 1. Carica Pyodide
            const pyodide = await loadPyodide();
            // 2. Carica micropip per gestire l'installazione del file .whl
            await pyodide.loadPackage("micropip");
            const micropip = pyodide.pyimport("micropip");
            // 3. Installa il tuo .whl locale
            await micropip.install("./pynarrative-0.4-py3-none-any.whl");
            console.log("Tutto ok");

            const output = await pyodide.runPythonAsync(`
                template_name = "${template_name}"
                str_template_name = template_name

                font_family = "${font_family}"
                standard_font_size = "${standard_font_size}"
                title_font_size_multiplier = "${title_font_size_multiplier}"
                subtitle_font_size_multiplier = "${subtitle_font_size_multiplier}"
                context_font_size_multiplier = "${context_font_size_multiplier}"
                nextstep_font_size_multiplier = "${nextstep_font_size_multiplier}"
                source_font_size_multiplier = "${source_font_size_multiplier}"

                primary_color = "${main_color}"
                secondary_color = "${secondary_color}"
                tab_color = "${tab_color}"
                tab_border_color = "${ta_border_color}"
                highlight_color = "${highlight_color}"
                title_color = "${title_color}"
                text_color = "${text_color}"

                from copy import deepcopy
                from pynarrative.templates.layout import DefaultLayout, Layout
                from pynarrative.templates.style import DefaultStyle, Style
                from pynarrative.templates.template import Template


                class myStyle(Style):
                    def __init__(self):
                        base = DefaultStyle()
                        super().__init__(deepcopy(base.data))

                        self.set_font(font_family)
                        self.set_base_font_size(int(standard_font_size))
                        self.set_font_sizes(
                            title = float(title_font_size_multiplier),
                            subtitle = float(subtitle_font_size_multiplier),
                            context = float(context_font_size_multiplier),
                            nextstep = float(nextstep_font_size_multiplier),
                            source = float(source_font_size_multiplier)
                        )

                        self.set_colors(
                            #TITOLO e SOTTOTITOLO
                            title = title_color,
                            subtitle = title_color,

                            #CONTESTO 1
                            context = text_color,

                            #BARRE
                            bar_muted = secondary_color,
                            bar_highlight = primary_color,

                            #ANNOTAZIONE
                            callout_text = highlight_color,
                            callout_arrow = highlight_color,
                            callout_point = highlight_color,

                            #NEXTSTEP
                            nextstep_box = tab_color,
                            nextstep_border = tab_border_color,
                            nextstep_text = text_color,
                            nextstep_title = text_color,

                            #FONTE
                            source = text_color,

                            #LABEL
                            chart_label_color = text_color
                        )

                        self.set_context_box(
                            #CONTESTO 
                            fill = tab_color,
                            stroke = tab_border_color,
                            padding=10,
                            corner_radius=10,
                            opacity=1.0,
                        )

                        self.set(
                            title_color=self.get_colors()['title'],
                            label_color='#594a37',
                            axis_tick_color='#d8c9ad',
                            axis_domain_color='#d8c9ad',
                            bar_fill_color = secondary_color,

                            series_colors = [secondary_color, primary_color, "#348035", "#a46cc2", "#d96027"],

                            reference_line_color = highlight_color, #linea orizzontale/verticale
                        )


                class myLayout(Layout):
                    """
                    Layout values.
                    """

                    def __init__(self):
                        base = DefaultLayout()
                        super().__init__(deepcopy(base.data))

                        self.set(
                            title_area_height=58,
                            title_y=4,
                            subtitle_y=30,
                            preferred_width=760,
                            preferred_height=560,
                            context_left_height_ratio=1.0,
                            context_right_height_ratio=1.0,
                        )


                class template_name (Template):
                    """
                    Custom style template.
                    """

                    def __init__(self):
                        super().__init__(
                            style=myStyle(),
                            layout=myLayout(),
                        )

                        

                import pynarrative as pn
                import pandas as pd
                import altair as alt
                import numpy as np
                import string

                np.random.seed(42)

                length = 10
                data = np.random.randint(0, 100, length)

                category_data = pd.DataFrame({
                    "category": [i for i in string.ascii_uppercase[:length]],
                    "data": data
                })


                storia = (
                    pn.Story(
                    #Costruzione dell'oggetto di classe Story
                        data = category_data,
                        width = 500,
                        height = 300,
                        template = template_name
                    )

                    #Chiamata dei metodi

                    .mark_bar(
                        cornerRadiusTopLeft = 7,
                        cornerRadiusTopRight = 7,

                    )

                    .encode( #encoding dei dati
                        x = alt.X("category:N", title = "Category", axis = alt.Axis(grid = True)),
                        y = alt.Y("data:Q", title = "Data", axis = alt.Axis(grid = True))
                    )
                    

                    .add_title( #titolo e sottotitolo
                        title = str_template_name,
                        subtitle = "Example of using pynarrative with a custom template",
                        align = "center"
                    )

                    .add_context( #contesto, testo, spiegazione
                        text = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                        position = "left",
                    )

                    .add_context( #contesto, testo, spiegazione
                        text = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                        position = "right",
                    )

                    .add_next_steps( #prossima parte della storia
                        steps = ["Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.", "ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat."],
                        title = "Next Steps",
                        position = "bottom"
                    )

                    .add_source( #fonte
                        text = "Source: sample data",
                        position = "bottom",
                        align = "right"
                    )

                    .add_labels_chart(
                        font_size = 20,
                        font_weight = "bold",
                        dy = 20
                    )

                    .add_line(
                        value = category_data["data"].tolist(),
                        math = "mean",
                        label_font_size = 16,
                        label_font_weight = "bold"
                    )

                    .add_line(
                        value = category_data["data"].tolist(),
                        math = "median",
                        label_font_size = 16,
                        label_font_weight = "bold"
                    )

                    .add_highlight("B")

                    .render()
                )

                storia.to_html(fullhtml = False)
            `);

            // Risultato
            output_box.html(output);

        } catch (err) {
            console.log("Error:");
            console.error(err);
        }
        }

        $(document).ready(function() {
            main();
        });
    })

});