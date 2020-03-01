<template>
  <div id="mynetwork" />
</template>

<script>

import vis from 'vis-network'

export default {
  props: {
    equipmentList: {
      type: Array,
      required: true
    },
    mapTable: {
      type: Array,
      required: true
    }
  },
  inject: ['onDoubleClickNode', 'onClickNode'],
  data() {
    return {
      picture: null,
      nodes: null,
      edges: null
    }
  },
  watch: {
    equipmentList: {
      deep: true,
      handler(val) {
        this.ChangeNode(val)
      }
    },
    mapTable: {
      deep: true,
      handler(val) {
        this.ChangeEdge(val)
      }
    }
  },
  mounted() {
    this.nodes = new vis.DataSet()
    this.edges = new vis.DataSet()
    this.HandleEquipment(this.equipmentList)
    this.HandleMapTable(this.mapTable)
    this.DrawPicture()
  },
  methods: {
    ChangeNode(EquipmentList) {
      this.HandleEquipment(EquipmentList)
      this.DrawPicture()
    },
    ChangeEdge(MapTable) {
      this.HandleMapTable(MapTable)
      this.DrawPicture()
    },
    HandleEquipment(EquipmentList) {
      this.nodes = new vis.DataSet()
      for (var i = 0; i < EquipmentList.length; i++) {
        this.nodes.update({
          id: i,
          label: EquipmentList[i].name,
          group: EquipmentList[i].type
        })
      }
    },
    HandleMapTable(MapTable) {
      this.edges = new vis.DataSet()
      for (var i = 0; i < MapTable.length; i++) {
        for (var j = 0; j < MapTable[i].length; j++) {
          if (i === j) {
            continue
          }
          if (MapTable[i][j]) {
            this.edges.update({
              from: i,
              to: j
            })
          }
        }
      }
    },
    DrawPicture() {
      var container = document.getElementById('mynetwork')
      var data = {
        nodes: this.nodes,
        edges: this.edges
      }
      var options = {
        edges: {
          color: 'gray'
          // smooth: false
        },
        groups: {
          'Route': {
            shape: 'square',
            color: '#109618'
          },
          'PC': {
            shape: 'dot',
            color: '#2B7CE9'
          },
          'Switch': {
            shape: 'triangle',
            color: '#FF9900'
          }
        },
        interaction: {
          zoomView: false
        }
      }
      this.picture = new vis.Network(container, data, options)
      this.picture.on('doubleClick', (params) => {
        const node = params.nodes
        if (node.length !== 0) {
          this.onDoubleClickNode(node[0])
        }
      })
      this.picture.on('oncontext', (params) => {
        const node = params.nodes
        if (node.length !== 0) {
          this.onClickNode(node[0])
        }
      })
    }
  }
}
</script>
