<template>
    <ul class="actions">
        <li @click="$emit('start')" class="action-item">START</li>
        <li @click="$emit('reset')" class="action-item">RESET</li>
        <img class="cursor-hand" src="~assets/img/cursor-hand.png" alt="cursor-hand">
    </ul>
</template>

<script>
export default {
    
}
</script>

<style lang="scss" scoped>

.actions {
    list-style: none;
    position: relative;
}

$item-height: 38px;
$cursor-height: 23px;
$cursor-padding-vertical: ($item-height - $cursor-height) / 2;

.action-item {
    color: #bbf;
    cursor: pointer;
    line-height: $item-height;

    &:hover ~ .cursor-hand {
        opacity: 1;
    }

    &:nth-child(1):hover ~ .cursor-hand { top: 0 }
    &:nth-child(2):hover ~ .cursor-hand { top: $item-height }
}

.cursor-hand {
    position: absolute;
    top: calc(50% - #{($cursor-height + $cursor-padding-vertical * 2) / 2});
    left: -50px;
    opacity: 0;
    animation: cursor-hand 1s infinite;
    transition: .3s;
    padding: $cursor-padding-vertical 0;
}

@keyframes cursor-hand {
    0% {
        transform: translate(-20%)
    }

    50% {
        transform: translate(20%)
    }

    100% {
        transform: translate(-20%)
    }
}
</style>
