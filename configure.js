$(document).ready(function(){

    $(window).on("scroll", function (){
        if ($(window).scrollTop() > 500) {
            $("#arrow_up").css("opacity", "1");
        } else {
            $("#arrow_up").css("opacity", "0");
        }
    });

    $("#copy1").on("click", function(){
        navigator.clipboard.writeText($("#to_copy1").text().trim());
        $(this).addClass("img_green");
        $(this).attr("title", "Copied!");
        setTimeout(function () {
            $("#copy1").removeClass("img_green");
        }, 2000);
    });

    $("#copy2").on("click", function(){
        navigator.clipboard.writeText($("#to_copy2").text().trim());
        $(this).addClass("img_green");
        $(this).attr("title", "Copied!");
        setTimeout(function () {
            $("#copy2").removeClass("img_green");
        }, 2000);
    });

    $("#context_corner_radius_selection div").on("click", function(){
        let was_selected = $(this).siblings(".context_corner_radius_selected");
        was_selected.removeClass("context_corner_radius_selected");
        let selected = $(this).addClass("context_corner_radius_selected");
        let radius = selected.css("border-top-left-radius");
        $("#tab_color_preview").css("border-radius", radius);
    });

    $("#stroke_slider").on("input", function(){
        let ta_border_stroke = $(this).val()
        $("#tab_color_preview").css("border-width", ta_border_stroke+"px");
    })

    $("#template_preview").on("click", function(){
        window.scrollTo(0, $("#download_box").offset().top);
    })

    function get_complementary_color(hex) {
        hex = hex.replace("#", "");

        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);

        r /= 255;
        g /= 255;
        b /= 255;

        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        h = (h + 0.5) % 1;

        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;

        function hueToRgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        let rComp = Math.round(hueToRgb(p, q, h + 1/3) * 255);
        let gComp = Math.round(hueToRgb(p, q, h) * 255);
        let bComp = Math.round(hueToRgb(p, q, h - 1/3) * 255);

        return `rgb(${rComp}, ${gComp}, ${bComp})`;
    }


    function check_contrast(background, foreground, contrast_element) {
        function hexToRgb(color) {
            if (color && color.startsWith("rgb")){
                let match = color.match(/\d+/g);
                return {
                    r: parseInt(match[0]),
                    g: parseInt(match[1]),
                    b: parseInt(match[2])
                };
            }

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
        let complementary_color = get_complementary_color($(this).val());
        $("#secondary_color_preview").css("background-color", complementary_color);
        $("#secondary_color_input").val(complementary_color);
        check_contrast(
            complementary_color,
            $("#secondary_color_preview").css("color"),
            "#secondary_color_contrast"
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

    $("#lines_color_input").on("input", function () {
        update_color(
            "#lines_color_input",
            "#lines_color_preview",
            "#lines_color_contrast"
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
        "#lines_color_input",
        "#lines_color_preview",
        "#lines_color_contrast"
    );

    update_color(
        "#secondary_color_input",
        "#secondary_color_preview",
        "#secondary_color_contrast"
    );

    $("#text_color_input").trigger("input");
    $("#font_selection").trigger("change");
    $("#font_size_selection").trigger("change");

    $("#font_selection").on("change", function() {
        let selected_font = $(this).val();
        $(".color_preview").css("font-family", selected_font);
        $("#title_color_preview").css("font-family", selected_font);
    });

    $("#font_size_selection").on("change", function() {
        let font_size = $(this).val();
        if (font_size > 24){
            font_size = 24;
        }
        $(".color_preview").css("font-size", font_size+"pt");
    });

    $("input#title_font_multiplier").on("input", function(){
        let base_font_size = $("#font_size_selection").val()
        let title_font_size = $(this).val() * base_font_size
        $("#title_color_preview").css("font-size", title_font_size)
    })


    $("#create_template").on("click", function(){
        $("#download_box").css("display", "none");
        let output_box = $("#template_preview");
        output_box.html("<img src='img/icon/loading_icon.gif'/>"); //gif di caricamento

        // Font options
        function check_font_size(size, min, max, default_size){
            if (size == ""){size = default_size;};
            if (size < min){size = min};
            if (size > max){size = max};
            return Number(size)
            
        }

        let template_name = $("#template_name").val();
        if (template_name == ""){
            template_name = "myTemplate";
        }
        $(".template_name_span").html(template_name+"Template");

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
        let lines_color = $("#lines_color_preview").css("background-color");

        // Other options
        let ta_border_radius = $("#tab_color_preview").css("border-radius");
        let ta_border_stroke = $("#tab_color_preview").css("border-width");

        function darkened_color(color) {
            const match = color.match(/\d+/g);
            const rgb = match.slice(0, 3).map(value => Math.min(255, parseInt(value, 10) - 70));
            return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
        }

        if ($("#secondary_color_preview").css("display") == "none"){
            secondary_color = main_color;
            main_color = darkened_color(secondary_color);
        }
        if ($("#tab_color_preview").css("display") == "none"){
            tab_color = "(255, 255, 255)";
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
            console.log("Pynarrative ok");

            const pythonTemplateCode =
`from copy import deepcopy
from pynarrative.templates.layout import DefaultLayout, Layout
from pynarrative.templates.style import DefaultStyle, Style
from pynarrative.templates.template import Template

#Font options
font_family = "${font_family}"
standard_font_size = ${standard_font_size}
title_font_size_multiplier = ${title_font_size_multiplier}
subtitle_font_size_multiplier = ${subtitle_font_size_multiplier}
context_font_size_multiplier = ${context_font_size_multiplier}
nextstep_font_size_multiplier = ${nextstep_font_size_multiplier}
source_font_size_multiplier = ${source_font_size_multiplier}

#Color options
main_color = "${main_color}"
secondary_color = "${secondary_color}"
tab_color = "${tab_color}"
ta_border_color = "${ta_border_color}"
lines_color = "${lines_color}"
title_color = "${title_color}"
text_color = "${text_color}"

#Border options
def remove_px(val):
    val_str = str(val).lower().replace("px", "").strip()
    return float(val_str)
ta_border_radius = "${ta_border_radius}"
ta_border_radius = remove_px(ta_border_radius)
ta_border_stroke = "${ta_border_stroke}"
ta_border_stroke = remove_px(ta_border_stroke)

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

        #COLOR OPTIONS
        self.set_colors(
            #Title and subtitle colors
            title = title_color,
            subtitle = title_color,

            #Context area(s) text color
            context = text_color,

            #Bars colors (if bar chart is used)
            bar_muted = main_color,
            bar_highlight = secondary_color, #(if .add_highlight() method is used)

            #.add_annotation() color options
            callout_text = lines_color,
            callout_arrow = lines_color,
            callout_point = lines_color,
            annotation_fill = main_color.replace("rgb", "rgba").replace(")", ", 0.5)"),
            annotation_text = text_color,
            annotation_stroke = ta_border_color,

            #Nextstep color options
            nextstep_box = tab_color,
            nextstep_border = ta_border_color,
            nextstep_text = text_color,
            nextstep_title = text_color,

            #Source text color
            source = text_color,

            #Label text color
            chart_label_color = text_color
        )

        self.set_context_box(
            #Context area(s) options 
            fill = tab_color,
            stroke = ta_border_color,
            padding = 25,
            corner_radius = ta_border_radius,
            opacity = 1.0,
        )

        self.set(
            #Other general options
            title_color=self.get_colors()['title'],
            label_color='#594a37',
            axis_tick_color='#d8c9ad',
            axis_domain_color='#d8c9ad',
            bar_fill_color = main_color,
            nextstep_corner_radius = ta_border_radius,
            context_border_width = ta_border_stroke,
            nextstep_border_width = ta_border_stroke,

            series_colors = [main_color, secondary_color, "#348035", "#a46cc2", "#d96027"],

            reference_line_color = lines_color, #horizontal and vertical lines
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


class ${template_name}Template(Template):
    """
    Custom style template.
    """

    def __init__(self):
        super().__init__(
            style=myStyle(),
            layout=myLayout(),
        )
`;
            
            await pyodide.runPythonAsync(pythonTemplateCode);


            const output = await pyodide.runPythonAsync(`
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
                        template = ${template_name}Template
                    )

                    #Chiamata dei metodi

                    .mark_bar(
                        cornerRadiusTopLeft = 7,
                        cornerRadiusTopRight = 7,
                    )

                    .encode( #encoding dei dati
                        x = alt.X("category:N", title = "Category", axis = alt.Axis(grid = True, labelAngle = 0)),
                        y = alt.Y("data:Q", title = "Data", axis = alt.Axis(grid = True))
                    )
                    

                    .add_title( #titolo e sottotitolo
                        title = "${template_name}Template",
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
                        steps = ["Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                                "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat."],
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
            $("#download_box").css("display", "block");

            $("#download").off("click").on("click", function(){
                const blob = new Blob([pythonTemplateCode], {type: 'text/x-python' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${template_name}Template.py`;
                document.body.appendChild(a);
                a.click();
                console.log("File correctly downloaded")
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            });

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