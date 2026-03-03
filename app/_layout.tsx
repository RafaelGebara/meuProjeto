import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Operador = "+" | "-" | "×" | "÷";

export default function RootLayout() {
  const [valor, setValor] = useState("");
  const [expressao, setExpressao] = useState("");

  const [primeiro, setPrimeiro] = useState<number | null>(null);
  const [primeiroTexto, setPrimeiroTexto] = useState("");
  const [operador, setOperador] = useState<Operador | null>(null);

  const [aguardandoSegundo, setAguardandoSegundo] = useState(false);
  const [acabou, setAcabou] = useState(false);

  const [opUnario, setOpUnario] = useState<"√" | null>(null);
  const [unarioTexto, setUnarioTexto] = useState("");

  function resetTudo() {
    setValor("");
    setExpressao("");
    setPrimeiro(null);
    setPrimeiroTexto("");
    setOperador(null);
    setAguardandoSegundo(false);
    setAcabou(false);
    setOpUnario(null);
    setUnarioTexto("");
  }

  function iniciarNovoNumero(n: string) {
    setValor(n);
    setExpressao(n);
    setPrimeiro(null);
    setPrimeiroTexto("");
    setOperador(null);
    setAguardandoSegundo(false);
    setOpUnario(null);
    setUnarioTexto("");
    setAcabou(false);
  }

  function digitarNumero(n: string) {
    if (acabou) {
      iniciarNovoNumero(n);
      return;
    }

    if (opUnario === "√") {
      const novo = (unarioTexto === "" ? n : unarioTexto + n);
      setUnarioTexto(novo);
      setValor(novo);
      setExpressao(`√${novo}`);
      return;
    }

    if (aguardandoSegundo) {
      setValor(n);
      setAguardandoSegundo(false);
      if (operador) setExpressao(`${primeiroTexto}${operador}${n}`);
      else setExpressao(n);
      return;
    }

    setValor((prev) => {
      const novo = prev === "" ? n : prev + n;

      if (operador === null) {
        setExpressao(novo);
      } else {
        setExpressao((prevExpr) => prevExpr + n);
      }

      return novo;
    });
  }

  function escolherOperador(op: Operador) {
    if (acabou) setAcabou(false);

    if (opUnario) {
      setOpUnario(null);
      setUnarioTexto("");
    }

    const atualTexto = valor === "" ? "0" : valor;
    const atual = Number(atualTexto);

    if (primeiro === null) {
      setPrimeiro(atual);
      setPrimeiroTexto(atualTexto);
      setOperador(op);
      setAguardandoSegundo(true);
      setExpressao(`${atualTexto}${op}`);
      return;
    }

    if (operador !== null && !aguardandoSegundo) {
      const resultado = calcular(primeiro, atual, operador);
      const resTexto = String(resultado);

      setPrimeiro(resultado);
      setPrimeiroTexto(resTexto);
      setOperador(op);
      setAguardandoSegundo(true);
      setExpressao(`${resTexto}${op}`);
      setValor("");
      return;
    }

    setOperador(op);
    setAguardandoSegundo(true);
    setExpressao(`${primeiroTexto}${op}`);
  }

  function calcular(a: number, b: number, op: Operador) {
    switch (op) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "×":
        return a * b;
      case "÷":
        return b === 0 ? 0 : a / b;
    }
  }

  function raizQuadrada() {
    if (acabou) setAcabou(false);

    if (operador !== null && aguardandoSegundo) return;

    const texto = valor === "" ? "0" : valor;

    setOpUnario("√");
    setUnarioTexto(texto);
    setExpressao(`√${texto}`);
    setValor(texto);

    setPrimeiro(null);
    setPrimeiroTexto("");
    setOperador(null);
    setAguardandoSegundo(false);
  }

  function igual() {
    if (opUnario === "√") {
      const n = Number(unarioTexto === "" ? "0" : unarioTexto);

      if (!Number.isFinite(n) || n < 0) {
        setValor("Erro");
      } else {
        setValor(String(Math.sqrt(n)));
      }

      setExpressao("");
      setOpUnario(null);
      setUnarioTexto("");
      setAcabou(true);
      return;
    }

    if (primeiro === null || operador === null) return;

    const atual = Number(valor === "" ? "0" : valor);
    const resultado = calcular(primeiro, atual, operador);

    setValor(String(resultado));
    setExpressao("");

    setPrimeiro(null);
    setPrimeiroTexto("");
    setOperador(null);
    setAguardandoSegundo(false);
    setAcabou(true);
  }

  function limpar() {
    resetTudo();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.numero}>
        {expressao !== "" ? expressao : valor === "" ? "0" : valor}
      </Text>

      <View style={styles.numerosCalculadora}>
        <View style={styles.grupo}>
          <TouchableOpacity style={styles.botao} onPress={() => digitarNumero("1")}>
            <Text style={styles.textoBotao}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botao} onPress={() => digitarNumero("2")}>
            <Text style={styles.textoBotao}>2</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botao} onPress={() => digitarNumero("3")}>
            <Text style={styles.textoBotao}>3</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botaoOperador} onPress={() => escolherOperador("÷")}>
            <Text style={styles.textoBotao}>÷</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.grupo}>
          <TouchableOpacity style={styles.botao} onPress={() => digitarNumero("4")}>
            <Text style={styles.textoBotao}>4</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botao} onPress={() => digitarNumero("5")}>
            <Text style={styles.textoBotao}>5</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botao} onPress={() => digitarNumero("6")}>
            <Text style={styles.textoBotao}>6</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botaoOperador} onPress={() => escolherOperador("×")}>
            <Text style={styles.textoBotao}>×</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.grupo}>
          <TouchableOpacity style={styles.botao} onPress={() => digitarNumero("7")}>
            <Text style={styles.textoBotao}>7</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botao} onPress={() => digitarNumero("8")}>
            <Text style={styles.textoBotao}>8</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botao} onPress={() => digitarNumero("9")}>
            <Text style={styles.textoBotao}>9</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botaoOperador} onPress={() => escolherOperador("-")}>
            <Text style={styles.textoBotao}>-</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.grupo}>
          <TouchableOpacity style={styles.botaoOperador} onPress={() => escolherOperador("+")}>
            <Text style={styles.textoBotao}>+</Text>
          </TouchableOpacity> 

          <TouchableOpacity style={styles.botaoOperador} onPress={raizQuadrada}>
            <Text style={styles.textoBotao}>√</Text>
          </TouchableOpacity>

           <TouchableOpacity style={styles.botaoOperador} onPress={limpar}>
            <Text style={styles.textoBotao}>C</Text>
          </TouchableOpacity>
             
             <TouchableOpacity style={styles.botaoOperador} onPress={igual}>
            <Text style={styles.textoBotao}>=</Text>
          </TouchableOpacity> 

        </View>
      </View>
    </View>
  );
}

const TAM = 80;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 40,
    backgroundColor: "#111",
  },
  numero: {
    fontSize: 64,
    color: "white",
    marginBottom: 30,
  },

  numerosCalculadora: {
    width: 380,
  },

  grupo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  botao: {
    backgroundColor: "#FF9500",
    width: TAM,
    height: TAM,
    borderRadius: TAM / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  botaoOperador: {
    backgroundColor: "#FF7A00",
    width: TAM,
    height: TAM,
    borderRadius: TAM / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  textoBotao: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
});