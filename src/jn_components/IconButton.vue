<template>
	<div style="position: relative">
		<button
			type="button"
			:class="['btn', colorTheme, { light: light }, 'animate', { deactivated: !active}]"
			@click="$emit('showSubmenu', !showSubmenu)"
		>
			<span :class="icon" />
			<span style="margin: 0 8px">{{ text }}</span>
			<span v-if="isDropdown" class="fas fa-caret-down"></span>
			<span v-if="isDropup" class="fas fa-caret-up"></span>
		</button>
		<transition name="fade">
			<div v-show="showSubmenu" :class="isDropdown ? 'dropdown' : 'dropup'">
				<slot name="submenu"> </slot>
			</div>
		</transition>
	</div>
</template>

<script>
export default {
	components: {},
	props: {
		icon: String,
		text: String,
		isDropdown: Boolean,
		isDropup: Boolean,
		showSubmenu: Boolean,
		light: Boolean,
		active: {
			type: Boolean,
			default: true
		},
		colorTheme: {
			type: String,
			default: "secondary",
			validator: function(value) {
				return ["blue", "pink", "gray", "green", "secondary"].indexOf(value) !== -1;
			},
		}
	},
	emits: ["showSubmenu"],
	methods: {
		close(e) {
			if (!this.$el.contains(e.target)) {
				this.$emit("showSubmenu", false);
			}
		},
	},
	mounted() {
		document.addEventListener("click", this.close);
	},
	unmounted() {
		document.removeEventListener("click", this.close);
	},
};
</script>

<style scoped>
.dropdown {
	display: block;
	background: white;
	margin: 0.2em 0;
	padding: 0;
	border-radius: 0.1875rem;
	list-style: none;
	box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
	position: absolute;
	top: 0px;
	left: 0px;
	will-change: transform;
	transform: translateY(33px);
	min-width: 11em;
	z-index: 1;
}
.dropup {
	display: block;
	background: white;
	margin: 0.2em 0;
	padding: 0;
	border-radius: 0.1875rem;
	list-style: none;
	box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
	position: absolute;
	bottom: 5em;
	will-change: transform;
	transform: translateY(33px);
	min-width: 11em;
}

.btn {
	white-space: nowrap;
}

.btn.deactivated {
	background:#F6F5F6 !important;
	color:#72616C !important;  
}

.btn.light.pink {
  color : #D41472; 
}

.btn.secondary {
	color: #44303C;
}
</style>
