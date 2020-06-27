# vuex review

## 四种特性

1. state(data): 
2. getters(computed):
3. mutations(methods, event): 同步
4. actions(methods, event): 异步

注意：
1. 更改状态使用commit/dispatch，便于vuetools追溯，尽量不使用this.$store.state.xxx
2. 在相应的computed/methods选项中使用...mapXxx(['xxx-name',...])直接展开这些方法（不用麻烦的一个个手写this.$store.commit('xxx-name', payload)/dispatch('xxx-name')），此时可以直接使用该方法名调用commit/dispatch（不用在组件中重新设立一个新的方法名）
3. actions中的参数是context，代表整个store，可以使用context.state/getters/commit/dispatch，或者参数使用解构赋值({ state, getters, commit, dispatch})
4. actions可以是异步的函数，故而可以直接使用async actions-name(context)，在内部可以使用await xxx;