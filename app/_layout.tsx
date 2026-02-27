import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function RootLayout() {
  const [valor, setValor] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.numero}>{valor}</Text>
      <View style= {styles.numerosCalculadora}>
      <TouchableOpacity>
      <Text> 1 </Text>
      </TouchableOpacity>
       <TouchableOpacity>
       <Text> 2 </Text>
       </TouchableOpacity>
        <TouchableOpacity>
        <Text> 3 </Text>
        </TouchableOpacity>
        <TouchableOpacity>
         <Text> 4 </Text>
         </TouchableOpacity>
        <TouchableOpacity>
        <Text> 5 </Text>
          </TouchableOpacity>
        <TouchableOpacity>
          <Text> 6 </Text>
           </TouchableOpacity>
        <TouchableOpacity>
           <Text> 7 </Text>
            </TouchableOpacity>
        <TouchableOpacity>
            <Text> 8 </Text>
             </TouchableOpacity>
         <TouchableOpacity>
             <Text> 9 </Text>
              </TouchableOpacity>
            </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  numero: {
    fontSize: 40,
    marginBottom: 20,
  },
  botao: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 8,
  },
  textoBotao: {
    color: "white",
    fontSize: 18,
  },
  numerosCalculadora: {
    justifyContent : "center"

  }
});