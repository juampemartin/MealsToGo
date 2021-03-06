import React, { useContext, useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { List } from "react-native-paper";

import { Text } from "../../../components/typography/text.component";
import { Spacer } from "../../../components/spacer/spacer.component";
import { SafeArea } from "../../../components/utility/safe-area.component";

import { CartContext } from "../../../services/cart/cart.context";

import { CreditCardInput } from "../components/credit-card.component";

import {
	CartIconContainer,
	CartIcon,
	NameInput,
	PayButton,
	ClearButton,
} from "../components/checkout.styles";
import { RestaurantInfoCard } from "../../restaurants/components/restaurant-info-card.component";
import { payRequest } from "../../../services/checkout/checkout.service";

export const CheckoutScreen = () => {
	const { cart, restaurant, clearCart, sum } = useContext(CartContext);
	const [name, setName] = useState("");
	const [card, setCard] = useState(null);

	const onPay = () => {
		if (!card || !card.id) {
			console.log("some error");
			return;
		}
		payRequest(card.id, sum, name);
	};

	if (!cart.length || !restaurant) {
		return (
			<SafeArea>
				<CartIconContainer>
					<CartIcon icon="cart-off" />
					<Text>Your cart is empty!</Text>
				</CartIconContainer>
			</SafeArea>
		);
	}
	return (
		<SafeArea>
			<RestaurantInfoCard restaurant={restaurant} />
			<ScrollView>
				<Spacer position="left" size="medium">
					<Spacer position="top" size="large">
						<Text>Your Order</Text>
					</Spacer>
					<List.Section>
						{cart.map((_, i, { price }) => {
							return <List.Item key={`item-${restaurant.placeId}-${i}`} title={`${restaurant.name} - ${price / 100}`} />;
						})}
					</List.Section>
					<Text>Total: {sum / 100}</Text>
				</Spacer>
				<NameInput
					label="Name"
					value={name}
					onChangeText={(t) => {
						setName(t);
					}}
				/>
				<Spacer position="top" size="large">
					{name.length > 0 && (
						<CreditCardInput name={name} onSuccess={setCard} />
					)}
				</Spacer>
				<Spacer position="top" size="xxl" />

				<PayButton icon="cash-usd" mode="contained" onPress={onPay}>
					Pay
				</PayButton>
				<Spacer position="top" size="large">
					<ClearButton icon="cart-off" mode="contained" onPress={clearCart}>
						Clear Cart
					</ClearButton>
				</Spacer>
			</ScrollView>
		</SafeArea>
	);
};

