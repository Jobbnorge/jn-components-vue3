<template>
	<div class="stars">
		<StarRating
			:star-size="size"
			:rating="showAmount"
			:max-rating="max"
			:read-only="inputDisabled"
			:increment="increment"
			:border-width="border"
			:show-rating="false"
			:inactive-color="inactiveColor"
			:border-color="borderColor"
			:active-color="activeColor"
			@update:rating="emitUpward"
		/>
		<span v-if="showAmountWithMax && showAmount">{{ `${showAmount} av ${max}` }}</span>
	</div>
</template>
<script>
import StarRating from "vue-star-rating";
export default {
	name: "JnStars",
	components: {
		StarRating,
	},
	props: {
		/** Hvor mange fylte stjerner som skal vises */
		showAmount: {
			type: Number,
			default: 0,
		},
		/** Max antall stjerner */
		max: {
			type: Number,
			default: 5,
		},
		/** Nyttig som egen prop dersom antall stjerner og verdi skal være ulikt (nederste eksempel) */
		value: {
			type: Number,
			default: 0,
		},
		/** Bruk denne dersom bruker ikke skal kunne endre antall stjerner */
		inputDisabled: {
			type: Boolean,
			default: false,
		},
		/** Skjul tekst på høyre side */
		hideRating: {
			type: Boolean,
			default: false,
		},
		/** Hvor mange biter skal en stjerne deles opp i ? */
		increment: {
			type: Number,
			default: 1,
		},
		border: {
			type: Number,
			default: 0,
		},
		inactiveColor: {
			type: String,
			default: "#CCCCCC",
		},
		borderColor: {
			type: String,
			default: '#737373'
		},
		activeColor: {
			type: String,
			default: '#D41472'
		},
		/** SVG-størrelse. Eksempelet viser 50 vs. 25 */
		size: {
			type: Number,
			default: 50,
		},
		showAmountWithMax: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		ratingOrValue: (vm) => {
			if (vm.value > vm.showAmount) {
				return true;
			} else {
				return false;
			}
		},
	},
	methods: {
		emitUpward(e) {
			/** Antall stjerner som er valgt 'videre-emittes' ett hakk opp */
			this.$emit("rating-selected", e);
		},
	},
};
</script>
<style scoped>
.stars {
	display: flex;
	align-items: center;
	margin: 0.5rem 0 0.5rem 0;
}
.stars > span {
	margin-left: 0.5rem;
}
</style>