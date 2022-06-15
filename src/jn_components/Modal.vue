<template>
	<transition name="modal">
		<div class="vue-modal">
			<div class="vue-modal-mask">
				<div class="vue-modal-wrapper">
					<div class="vue-modal-container">
						<div class="vue-modal-header">
							<span class="close-x" @click="$emit('close')"> &times; </span>
							<slot name="header"> </slot>
						</div>

						<div class="vue-modal-body vue-vue-modal-body">
							<slot name="body"> </slot>
						</div>

						<div class="vue-modal-footer">
							<slot name="footer"> </slot>
						</div>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	emits: ["close"],
};
</script>

<style scoped>
.vue-modal-mask {
	position: fixed;
	z-index: 9998;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: block;
	overflow: auto;
	transition: opacity 0.3s ease;
}

.vue-modal-wrapper {
	vertical-align: middle;
}

.vue-modal-body {
	padding: 14px;
}
.vue-modal-footer {
	padding: 0 1.5em 1.5em 1.5em;
}
.vue-modal-container {
	min-width: 35%;
	max-width: 80%; /* remember media queries */
	margin: auto;
	margin-top: 30px;
	width: fit-content;
	background-color: #fff;
	border-radius: 3px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
	transition: all 0.3s ease;
}

.vue-modal-header h3 {
	color: #42b983;
}
.vue-modal-header {
	padding: 20px 0 0 16px;
}
.vue-modal-default-button {
	float: right;
}

.vue-modal-enter {
	opacity: 0;
}

.vue-modal-leave-active {
	opacity: 0;
}
.vue-modal-enter .vue-modal-container,
.vue-modal-leave-active .vue-modal-container {
	-webkit-transform: scale(1.1);
	transform: scale(1.1);
}
li {
	padding: 0.5em 1em;
	font-size: 14px;
}
li:hover {
	background: #e2e2e2;
}
.close-x {
	cursor: pointer;
	float: right;
	font-size: 40px;
	margin: -10px 10px;
}
.close-x:hover {
	color: #6e6e6e;
}
</style>