async function main() {
  const output_box = $("#template_gallery");

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
        import pynarrative as pn
        import pandas as pd
        import altair as alt
        import numpy as np
        import string

        np.random.seed(42)

        length = 10
        valori = np.random.randint(0, 100, length)

        dati_categorie = pd.DataFrame({
            "categorie": [i for i in string.ascii_uppercase[:length]],
            "valori": valori
        })


        storia = (
            pn.Story(
            #Costruzione dell'oggetto di classe Story
                data = dati_categorie,
                width = 500,
                height = 300,
            )

            #Chiamata dei metodi

            .mark_bar(
                cornerRadiusTopLeft = 7,
                cornerRadiusTopRight = 7,

            )

            .encode( #encoding dei dati
                x = alt.X("categorie:N", title = "Categoria", axis = alt.Axis(grid = True)),
                y = alt.Y("valori:Q", title = "Valore", axis = alt.Axis(grid = True))
            )
            

            .add_title( #titolo e sottotitolo
                title = "Grafico a barre con dati e categorie",
                subtitle = "Esempio di utilizzo di pynarrative",
                align = "center"
            )

            .add_context( #contesto, testo, spiegazione
                text = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                position = "left",
            )


            .add_next_steps( #prossima parte della storia
                steps = ["Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.", "ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat."],
                title = "Next Steps", #
                position = "bottom" #
            )

            .add_source( #fonte
                text = "Fonte: dati di esempio",
                position = "bottom",
                align = "right"
            )

            .add_labels_chart(
                font_size = 20,
                font_weight = "bold",
                dy = 20
            )

            .add_line(
                value = dati_categorie["valori"].tolist(),
                math = "mean",
                color = "green",
                label_text = "Media 62.4",
                label_font_size = 16,
                label_font_weight = "bold"
            )

            .add_line(
                value = dati_categorie["valori"].tolist(),
                math = "median",
                color = "darkblue",
                label_text = "Mediana 72.5",
                label_font_size = 16,
                label_font_weight = "bold"
            )

            .add_highlight("B")

            .render()
        )

        storia.to_html()


    `);

    // Risultato
    output_box.html(output);

  } catch (err) {
    console.log("Error:");
    console.error(err);
  }
}

// Avvio automatico al completamento del caricamento del DOM tramite jQuery
$(document).ready(function() {
  main();
});