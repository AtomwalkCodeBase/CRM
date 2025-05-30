import React, { useState } from "react";
import { View, Text, Modal, Image, TouchableOpacity, FlatList, Linking, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ToastMsg from "../ToastMsg";

const ProductSelectionModal = ({ visible, onClose, products }) => {
    const [selectedProducts, setSelectedProducts] = useState([]);

    const toggleSelection = (product) => {
        setSelectedProducts((prev) =>
            prev.includes(product.product_url)
                ? prev.filter((item) => item !== product.product_url)
                : [...prev, product.product_url]
        );
    };

    const shareViaWhatsApp = () => {
        if (selectedProducts.length > 0) {
            const selectedItems = products.filter((product) => selectedProducts.includes(product.product_url));
            const message = selectedItems.map((product) => `${product.product_name}: ${product.product_url}`).join("\n");
            const url = `https://wa.me/?text=${encodeURIComponent("Check out these products:\n" + message)}`;
            Linking.openURL(url);
        }
        else{
            ToastMsg("Please select at least one product to share.");
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Select Products</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="black" />
                        </TouchableOpacity>
                    </View>

                    {/* Product List */}
                    <FlatList
                        data={products}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => toggleSelection(item)} style={styles.productItem}>
                                <Image source={{ uri: item.image }} style={styles.productImage} />
                                <Text style={styles.productName} numberOfLines={2}>
                                    {item.product_name}
                                </Text>
                                {selectedProducts.includes(item.product_url) && (
                                    <Ionicons name="checkmark-circle" size={24} color="green" style={styles.checkIcon} />
                                )}
                            </TouchableOpacity>
                        )}
                    />

                    {/* Share Button */}
                    <View style={styles.footer}>
                      <TouchableOpacity onPress={shareViaWhatsApp} style={styles.shareButton}>
                            <Ionicons name="share-social" size={30} color="white" />
                            <Text style={styles.shareButtonText}>Share</Text>
                        </TouchableOpacity>
                        <Text style={styles.instructionText}>
                        Select one or multiple products and share the catalog via WhatsApp.
                        </Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 12,
        width: "90%",
        maxHeight: "80%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    },
    closeButton: {
        padding: 5,
    },
    productItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    productImage: {
        width: 50,
        height: 50,
        borderRadius: 5,
        marginRight: 10,
    },
    productName: {
        flex: 1,
        fontSize: 16,
        color: "#333",
    },
    checkIcon: {
        marginLeft: "auto",
    },
    footer: {
        alignItems: "center",
        marginTop: 20,
    },
    instructionText: {
        fontSize: 14,
        color: "#555",
        marginBottom: 10,
        textAlign: "center",
        marginTop: 5,
    },
    shareButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "green",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    shareButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 8,
    },
});

export default ProductSelectionModal;
