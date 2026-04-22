import express from "express";
import { retornaHistorico } from "./src/dbRepository.js";

const app = express();

app.get("/api/ohlc/:ticker/:dias", (req, res) => {

    const ticker = req.params.ticker;
    const dias = parseInt(req.params.dias);
    console.log("Ticker: " + ticker);
    console.log("Dias: " + dias);
    const dados = retornaHistorico(ticker, dias);

    res.json(dados);

});

app.listen(3001, () => {
    console.log("API rodando na porta 3001");
});